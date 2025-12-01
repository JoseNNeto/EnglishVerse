import { createContext, useState, useEffect, useContext, type ReactNode, useCallback } from 'react';
import api from '../services/api';

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
    tipoAtividade: 'MULTIPLA_ESCOLHA' | 'PREENCHER_LACUNA' | 'SELECIONAR_PALAVRAS' | 'LISTA_PALAVRAS'; // Enum: TipoAtividade
    instrucao: string;
    dadosAtividade: Record<string, any>; // JSONB as a generic object
}

// Corresponds to ProductionChallenge.java
interface ProductionChallenge {
    id: number;
    moduloId: number;
    tipoDesafio: 'AUDIO' | 'TEXTO_LONGO' | 'FOTO_E_TEXTO' | 'UPLOAD_ARQUIVO' | 'RELACIONAR_COLUNAS' | 'SUBSTITUIR_PALAVRAS' | 'COMPLETAR_IMAGEM'; // Enum: TipoDesafio
    instrucaoDesafio: string;
    midiaDesafioUrl?: string;
    dadosDesafio: Record<string, any>; // JSONB as a generic object
}

// Unified type for sidebar items
export type ModuleItem = 
    | { type: 'presentation'; data: RecursoApresentacao }
    | { type: 'practice'; data: PracticeAtividade }
    | { type: 'production'; data: ProductionChallenge };


// --- Context Definition ---

interface ModuleContextType {
    loading: boolean;
    modulo: Modulo | null;
    presentations: RecursoApresentacao[];
    practices: PracticeAtividade[];
    productions: ProductionChallenge[];
    allItems: ModuleItem[]; // Combined and sorted list for the sidebar
    activeItem: ModuleItem | null;
    setActiveItem: (item: ModuleItem) => void;
    moduloId: string | undefined;
    completedItems: Set<string>; // Use string for a composite key like 'practice-123'
    markItemAsCompleted: (itemId: string) => void;
    completionProgressPercentage: number;
    positionalProgressPercentage: number;
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
    const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

    const markItemAsCompleted = useCallback((itemId: string) => {
        setCompletedItems(prev => new Set(prev).add(itemId));
        // Here you might also want to post this progress to the backend
        // Example: api.post('/progresso', { itemId, moduloId });
    }, []);

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
                    prodResponse
                ] = await Promise.all([
                    api.get<Modulo>(`/modulos/${moduloId}`),
                    api.get<RecursoApresentacao[]>(`/recursos/modulo/${moduloId}`),
                    api.get<PracticeAtividade[]>(`/practice/modulo/${moduloId}`),
                    api.get<ProductionChallenge[]>(`/production/modulo/${moduloId}`)
                ]);

                setModulo(moduloResponse.data);

                const fetchedPresentations = presResponse.data.sort((a, b) => a.ordem - b.ordem);
                const fetchedPractices = pracResponse.data;
                const fetchedProductions = prodResponse.data;

                setPresentations(fetchedPresentations);
                setPractices(fetchedPractices);
                setProductions(fetchedProductions);

                // Combine and structure data for the sidebar
                const combinedItems: ModuleItem[] = [
                    ...fetchedPresentations.map(p => ({ type: 'presentation', data: p } as ModuleItem)),
                    ...fetchedPractices.map(p => ({ type: 'practice', data: p } as ModuleItem)),
                    ...fetchedProductions.map(p => ({ type: 'production', data: p } as ModuleItem)),
                ];

                setAllItems(combinedItems);

                // Set the first presentation item as the default active item
                if (combinedItems.length > 0) {
                    setActiveItem(combinedItems[0]);
                }

            } catch (error) {
                console.error("Failed to fetch module data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchModuleData();
    }, [moduloId]);

    const completionProgressPercentage = allItems.length > 0 ? (completedItems.size / allItems.length) * 100 : 0;

    const activeItemIndex = activeItem ? allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id) : -1;
    const positionalProgressPercentage = allItems.length > 0 && activeItemIndex > -1
        ? ((activeItemIndex + 1) / allItems.length) * 100
        : 0;

    const value = { 
        loading, 
        modulo,
        presentations, 
        practices, 
        productions, 
        allItems,
        activeItem, 
        setActiveItem,
        moduloId,
        completedItems,
        markItemAsCompleted,
        completionProgressPercentage,
        positionalProgressPercentage
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