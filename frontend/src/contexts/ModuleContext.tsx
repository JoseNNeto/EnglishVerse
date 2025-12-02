import { createContext, useState, useEffect, useContext, type ReactNode, useRef, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext'; // Import useAuth

// --- Interfaces based on backend models ---

export interface Modulo {
    id: number;
    titulo: string;
    descricao: string;
    imagemCapaUrl: string;
}

// Corresponds to RecursoApresentacao.java
interface RecursoApresentacao {
    id: number;
    moduloId: number;
    tipoRecurso: 'VIDEO' | 'TEXTO' | 'AUDIO'; // Enum: TipoRecurso
    urlRecurso: string;
    transcricao?: string;
    ordem: number;
}

// Corresponds to PracticeAtividade.java
interface PracticeAtividade {
    id: number;
    moduloId: number;
    tipoAtividade: 'MULTIPLA_ESCOLHA' | 'PREENCHER_LACUNA' | 'SELECIONAR_PALAVRAS' | 'LISTA_PALAVRAS' | 'RELACIONAR_COLUNAS' | 'SUBSTITUIR_PALAVRAS'; // Enum: TipoAtividade
    instrucao: string;
    dadosAtividade: Record<string, any>; // JSONB as a generic object
}

// Corresponds to ProductionChallenge.java
interface ProductionChallenge {
    id: number;
    moduloId: number;
    tipoDesafio: 'AUDIO' | 'TEXTO_LONGO' | 'FOTO_E_TEXTO' | 'UPLOAD_ARQUIVO' | 'COMPLETAR_IMAGEM'; // Enum: TipoDesafio
    instrucaoDesafio: string;
    midiaDesafioUrl?: string;
    dadosDesafio: Record<string, any>; // JSONB as a generic object
}

// Unified type for sidebar items
export type ModuleItem = 
    | { type: 'presentation'; data: RecursoApresentacao }
    | { type: 'practice'; data: PracticeAtividade }
    | { type: 'production'; data: ProductionChallenge };

// Define ItemType mirroring Java backend (erasable-friendly: runtime const + type)
export const ItemType = {
    PRESENTATION: 'PRESENTATION',
    PRACTICE: 'PRACTICE',
    PRODUCTION: 'PRODUCTION',
} as const;

export type ItemType = (typeof ItemType)[keyof typeof ItemType];

// Define StatusProgresso mirroring Java backend
export const StatusProgresso = {
    NAO_INICIADO: 'NAO_INICIADO',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    CONCLUIDO: 'CONCLUIDO',
} as const;

export type StatusProgresso = typeof StatusProgresso[keyof typeof StatusProgresso];

// Define ProgressoItemResponseDTO mirroring Java backend
export interface ProgressoItemResponseDTO {
    id: number;
    alunoId: number;
    moduloId: number;
    itemId: number;
    itemType: ItemType;
    dataConclusao: string; // ISO date string
}

// --- Context Definition ---

interface ModuleContextType {
    loading: boolean;
    modulo: Modulo | null;
    presentations: RecursoApresentacao[];
    practices: PracticeAtividade[];
    productions: ProductionChallenge[];
    allItems: ModuleItem[]; // Combined and sorted list for the sidebar
    activeItem: ModuleItem | null;
    completedItems: ProgressoItemResponseDTO[];
    handleSelectItem: (item: ModuleItem) => void;
    handleNextItem: () => void;
    markItemAsCompleted: (itemId: number, itemType: ItemType) => Promise<void>;
    moduloId: string | undefined;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

// --- Provider Component ---

interface ModuleProviderProps {
    children: ReactNode;
    moduloId: string;
}

export const ModuleProvider = ({ children, moduloId }: ModuleProviderProps) => {
    const [loading, setLoading] = useState(true);
    const [modulo, setModulo] = useState<Modulo | null>(null);
    const [presentations, setPresentations] = useState<RecursoApresentacao[]>([]);
    const [practices, setPractices] = useState<PracticeAtividade[]>([]);
    const [productions, setProductions] = useState<ProductionChallenge[]>([]);
    const [allItems, setAllItems] = useState<ModuleItem[]>([]);
    const [activeItem, setActiveItem] = useState<ModuleItem | null>(null);
    const [completedItems, setCompletedItems] = useState<ProgressoItemResponseDTO[]>([]);

    const { user } = useAuth(); // Consume useAuth

    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- API Call Functions ---
    const markItemAsCompleted = useCallback(async (itemId: number, type: ItemType) => {
        if (!moduloId) return;

        try {
            const response = await api.post<ProgressoItemResponseDTO>('/progresso/item', {
                moduloId: Number(moduloId),
                itemId: itemId,
                itemType: type,
            });

            // Use functional update to add the new item only if it's not already present
            setCompletedItems((prev) => {
                const isAlreadyPresent = prev.some(item => item.id === response.data.id);
                return isAlreadyPresent ? prev : [...prev, response.data];
            });

        } catch (error) {
            // Check for 400 Bad Request which might indicate a duplicate, or other errors
            console.error('Failed to mark item as completed:', error);
        }
    }, [moduloId]); // Now stable as long as moduloId is stable.

    // --- Navigation Functions ---
    const handleSelectItem = useCallback((item: ModuleItem) => {
        setActiveItem(item);
    }, []); // Now stable, no dependencies.

    const handleNextItem = useCallback(() => {
        if (!activeItem || allItems.length === 0) return;

        // Mark current item as completed if it's a presentation
        if (activeItem.type === 'presentation') {
            markItemAsCompleted(activeItem.data.id, ItemType.PRESENTATION);
        }

        const currentIndex = allItems.findIndex(
            (item) => item.data.id === activeItem.data.id && item.type === activeItem.type
        );

        if (currentIndex !== -1 && currentIndex < allItems.length - 1) {
            handleSelectItem(allItems[currentIndex + 1]);
        }
    }, [activeItem, allItems, handleSelectItem, markItemAsCompleted]);


    // Effect for fetching all initial module data
    useEffect(() => {
        const fetchModuleData = async () => {
            if (!moduloId) return;

            setLoading(true);
            try {
                // Fetch all data concurrently
                const [
                    moduloResponse,
                    presResponse, 
                    pracResponse, 
                    prodResponse,
                    progressoResponse
                ] = await Promise.all([
                    api.get<Modulo>(`/modulos/${moduloId}`),
                    api.get<RecursoApresentacao[]>(`/recursos/modulo/${moduloId}`),
                    api.get<PracticeAtividade[]>(`/practice/modulo/${moduloId}`),
                    api.get<ProductionChallenge[]>(`/production/modulo/${moduloId}`),
                    api.get<ProgressoItemResponseDTO[]>(`/progresso/modulo/${moduloId}/itens`)
                ]);

                setModulo(moduloResponse.data);

                const fetchedPresentations = presResponse.data.sort((a, b) => a.ordem - b.ordem);
                const fetchedPractices = pracResponse.data;
                const fetchedProductions = prodResponse.data;

                setPresentations(fetchedPresentations);
                setPractices(fetchedPractices);
                setProductions(fetchedProductions);
                setCompletedItems(progressoResponse.data);

                const combinedItems: ModuleItem[] = [
                    ...fetchedPresentations.map(p => ({ type: 'presentation', data: p } as ModuleItem)),
                    ...fetchedPractices.map(p => ({ type: 'practice', data: p } as ModuleItem)),
                    ...fetchedProductions.map(p => ({ type: 'production', data: p } as ModuleItem)),
                ];

                setAllItems(combinedItems);

                // Set the first item, but only if one isn't already active
                if (combinedItems.length > 0 && !activeItem) {
                    setActiveItem(combinedItems[0]);
                }

                // Call to start module progress
                if (user && user.id) {
                    try {
                        await api.post('/progresso/iniciar', null, {
                            params: {
                                alunoId: user.id,
                                moduloId: Number(moduloId)
                            }
                        });
                        console.log('Module started successfully or already started.');
                    } catch (startError) {
                        console.error('Failed to start module progress:', startError);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch module data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchModuleData();
    }, [moduloId, user]); // Include 'user' in dependencies


    const value = { 
        loading, 
        modulo,
        presentations, 
        practices, 
        productions, 
        allItems,
        activeItem, 
        completedItems,
        handleSelectItem,
        handleNextItem,
        markItemAsCompleted,
        moduloId
    };

    return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
};

// --- Custom Hook ---

export const useModule = () => {
    const context = useContext(ModuleContext);
    if (context === undefined) {
        throw new Error('useModule must be used within a ModuleProvider');
    }
    return context;
};