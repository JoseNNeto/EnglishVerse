import { Box, Typography, Paper, LinearProgress, Button, Grid } from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable, type UniqueIdentifier, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModule } from '../../../contexts/ModuleContext';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (e) {
        console.error("Invalid URL for YouTube embed:", e);
        return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

interface ProductionRelacionarContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
    isLast?: boolean;
}

interface RelacionarData {
    quotes: { id: string; text: string; }[];
    characters: { id: string; name: string; }[];
    gabarito: Record<string, string>;
}

interface Character {
    id: string;
    name: string;
}

type VerificationStatus = 'correct' | 'incorrect' | 'idle';

function DraggableQuote({ id, text }: { id: UniqueIdentifier, text: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
    };
    return (
        <Paper ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#282828' }}>
            <DragIndicatorIcon sx={{ color: '#b3b3b3' }} />
            <Typography sx={{ color: '#e0e0e0' }}>{text}</Typography>
        </Paper>
    );
}

function DroppableCharacter({ char, quote, onRemoveQuote, status }: { char: Character, quote: { id: UniqueIdentifier, text: string } | undefined, onRemoveQuote: (quoteId: UniqueIdentifier, charId: UniqueIdentifier) => void, status: VerificationStatus }) {
    const { setNodeRef, isOver } = useDroppable({ id: char.id });

    const getBorderColor = () => {
        switch (status) {
            case 'correct': return 'lightgreen';
            case 'incorrect': return 'red';
            default: return '#b3b3b3';
        }
    };

    return (
        <Paper ref={setNodeRef} sx={{ p: 2, mb: 2, bgcolor: isOver ? '#333' : '#1a1a1a', transition: 'background-color 0.2s, border-color 0.2s', border: `2px solid ${getBorderColor()}` }}>
            <Typography sx={{ color: '#007aff', mb: 1 }}>{char.name}</Typography>
            <Box 
                sx={{ minHeight: 60, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => quote && onRemoveQuote(quote.id, char.id)}
            >
                {quote ? <Typography sx={{ color: '#e0e0e0', cursor: 'pointer' }}>{quote.text}</Typography> : <Typography sx={{ color: '#b3b3b3' }}>Solte a fala aqui</Typography>}
            </Box>
        </Paper>
    );
}

function DroppableColumn({ id, title, items }: { id: UniqueIdentifier, title: string, items: { id: UniqueIdentifier, text: string }[] }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <Box>
            <Typography variant="h6" sx={{mb: 2}}>{title}</Typography>
            <Paper ref={setNodeRef} sx={{ p: 2, bgcolor: isOver ? '#333' : '#1a1a1a', minHeight: 200, borderRadius: 2, transition: 'background-color 0.2s ease-in-out' }}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        {items.map(item => <DraggableQuote key={item.id} id={item.id} text={item.text} />)}
                    </Box>
                </SortableContext>
            </Paper>
        </Box>
    );
}

export default function ProductionRelacionarContent({ data, isLast }: ProductionRelacionarContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo } = useModule();
    const { user } = useAuth();
    const navigate = useNavigate();
    const relacionarData = data.dadosDesafio as RelacionarData;
    
    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');

    const initialContainers = useMemo(() => {
        const containers: Record<string, { id: UniqueIdentifier, text: string }[]> = {
            unassigned: relacionarData.quotes || [],
        };
        (relacionarData.characters || []).forEach(char => {
            containers[char.id] = [];
        });
        return containers;
    }, [relacionarData.quotes, relacionarData.characters]);

    const [containers, setContainers] = useState(initialContainers);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<Record<string, VerificationStatus>>({});

    const sensors = useSensors(useSensor(PointerSensor));

    const findContainer = (id: UniqueIdentifier) => id in containers ? id as string : Object.keys(containers).find(key => containers[key].some(item => item.id === id));
    
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
        setVerificationStatus({}); // Reset status on new drag
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const originalContainerId = findContainer(active.id);
        const overContainerId = findContainer(over.id);
    
        if (!originalContainerId || !overContainerId || originalContainerId === overContainerId) {
            if (originalContainerId === 'unassigned' && overContainerId === 'unassigned' && containers['unassigned'].findIndex(i => i.id === over.id) >= 0) {
                 setContainers(prev => ({...prev, unassigned: arrayMove(prev.unassigned, prev.unassigned.findIndex(i => i.id === active.id), prev.unassigned.findIndex(i => i.id === over.id))}));
            }
            return;
        }
    
        setContainers(prev => {
            const newContainers = { ...prev };
            const activeIndex = newContainers[originalContainerId].findIndex(item => item.id === active.id);
            if (activeIndex === -1) return newContainers;
            const [movedItem] = newContainers[originalContainerId].splice(activeIndex, 1);
            if (overContainerId !== 'unassigned' && newContainers[overContainerId].length > 0) {
                const [displacedItem] = newContainers[overContainerId].splice(0, 1);
                newContainers['unassigned'].push(displacedItem);
            }
            newContainers[overContainerId].push(movedItem);
            return newContainers;
        });
    };

    const handleRemoveQuote = (quoteId: UniqueIdentifier, charId: UniqueIdentifier) => {
        setContainers(prev => {
            const newContainers = {...prev};
            const charContainer = newContainers[charId as string];
            const quoteIndex = charContainer.findIndex(item => item.id === quoteId);
            if (quoteIndex > -1) {
                const [removedQuote] = charContainer.splice(quoteIndex, 1);
                newContainers['unassigned'].push(removedQuote);
            }
            return newContainers;
        });
        setVerificationStatus(prev => ({...prev, [charId as string]: 'idle'})); // Reset status on removal
    };

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;
        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        } else {
            if (user && modulo) {
                api.put(`/progresso/concluir?alunoId=${user.id}&moduloId=${modulo.id}`)
                    .then(() => {
                        console.log("Módulo concluído! Redirecionando...");
                        setTimeout(() => navigate('/'), 1500); 
                    })
                    .catch(console.error);
            }
        }
    };

    const handleSubmit = () => {
        if (containers.unassigned.length > 0 || !activeItem) {
            console.log("Por favor, arraste todas as falas para os personagens.");
            return;
        }

        const correctGabarito: Record<string, string> = relacionarData.gabarito;
        const newStatus: Record<string, VerificationStatus> = {};
        let allCorrect = true;

        (relacionarData.characters || []).forEach(char => {
            const assignedQuote = containers[char.id] ? containers[char.id][0] : undefined;
            if (assignedQuote && correctGabarito[char.id] === assignedQuote.id) {
                newStatus[char.id] = 'correct';
            } else {
                newStatus[char.id] = 'incorrect';
                allCorrect = false;
            }
        });

        setVerificationStatus(newStatus);

        if (allCorrect) {
            setTimeout(() => {
                markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
                handleNext();
            }, 1000); 
        }
    };

    const activeQuote = activeId ? Object.values(containers).flat().find(q => q.id === activeId) : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ color: '#e0e0e0' }}>
                        <Typography variant="h4">Etapa: Desafio de Produção - Relacionar</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>{data.instrucaoDesafio}</Typography>
                        </Box>

                        {embedUrl && (
                            <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '14px', overflow: 'hidden', mb: 3, border: '1px solid #282828', width: '50%', margin: '0 auto' }}>
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={embedUrl} 
                                    title="YouTube video player" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin" 
                                    allowFullScreen 
                                    style={{ position: 'absolute', top: 0, left: 0, border: 0 }}
                                ></iframe>
                            </Box>
                        )}

                        <Grid container spacing={4} sx={{ px: 6 }}>
                            <Grid size={{ xs:6 }}>
                                <Typography variant="h6" sx={{mb: 2}}>Personagens</Typography>
                                {(relacionarData.characters || []).map((char: Character) => (
                                    <DroppableCharacter 
                                        key={char.id} 
                                        char={char} 
                                        quote={containers[char.id] ? containers[char.id][0] : undefined} 
                                        onRemoveQuote={handleRemoveQuote}
                                        status={verificationStatus[char.id] || 'idle'}
                                    />
                                ))}
                            </Grid>
                            <Grid size={{ xs:6 }}>
                                <DroppableColumn id="unassigned" title="Falas" items={containers.unassigned || []} />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                sx={{ textTransform: 'none', borderRadius: 3 }}
                                onClick={handleSubmit}
                                disabled={containers.unassigned.length > 0}
                            >
                                {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <DragOverlay>
                {activeQuote ? <DraggableQuote id={activeQuote.id} text={activeQuote.text} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
