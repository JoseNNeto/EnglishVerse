
import { Box, Typography, Paper, LinearProgress, Button, Grid } from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable, type UniqueIdentifier, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface PracticeRelacionarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

// Assuming data structure for RELACIONAR type in dadosDesafio
interface RelacionarData {
    quotes: { id: string; text: string; }[];
    characters: { id: string; name: string; }[];
}

interface Character {
    id: string;
    name: string;
}

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

function DroppableCharacter({ char, quote, onRemoveQuote }: { char: Character, quote: { id: UniqueIdentifier, text: string } | undefined, onRemoveQuote: (quoteId: UniqueIdentifier, charId: UniqueIdentifier) => void }) {
    const { setNodeRef, isOver } = useDroppable({ id: char.id });

    return (
        <Paper ref={setNodeRef} sx={{ p: 2, mb: 2, bgcolor: isOver ? '#333' : '#1a1a1a', transition: 'background-color 0.2s ease-in-out' }}>
            <Typography sx={{ color: '#007aff', mb: 1 }}>{char.name}</Typography>
            <Box 
                sx={{ border: '2px dashed #b3b3b3', borderRadius: 2, p: 2, minHeight: 60, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => quote && onRemoveQuote(quote.id, char.id)}
            >
                {quote ? (
                    <Typography sx={{ color: '#e0e0e0', cursor: 'pointer' }}>{quote.text}</Typography>
                ) : (
                    <Typography sx={{ color: '#b3b3b3' }}>Solte a fala aqui</Typography>
                )}
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

export default function PracticeRelacionarContent({ data }: PracticeRelacionarContentProps) {
    const relacionarData = data.dadosAtividade as RelacionarData;

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

    const sensors = useSensors(useSensor(PointerSensor));

    const findContainer = (id: UniqueIdentifier) => {
        if (id in containers) {
            return id as string;
        }
        return Object.keys(containers).find(key => containers[key].some(item => item.id === id));
    };
    
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
    
        if (!over) return;
    
        const originalContainerId = findContainer(active.id);
        const overContainerId = findContainer(over.id);
    
        if (!originalContainerId || !overContainerId || originalContainerId === overContainerId) {
            if (originalContainerId === 'unassigned' && overContainerId === 'unassigned' && containers['unassigned'].findIndex(i => i.id === over.id) >= 0) {
                 setContainers(prev => {
                    const newUnassigned = arrayMove(prev.unassigned, prev.unassigned.findIndex(i => i.id === active.id), prev.unassigned.findIndex(i => i.id === over.id));
                    return {...prev, unassigned: newUnassigned};
                 });
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
        })
    };

    const activeQuote = activeId ? Object.values(containers).flat().find(q => q.id === activeId) : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
                <Box sx={{ width: '90%' }}>
                    <Box sx={{ color: '#e0e0e0' }}>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
                            </Box>
                            <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4 }} /> {/* Placeholder */}
                        </Box>

                        <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Prática - Relacionar</Typography>
                        
                        <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>Sua Prática</Typography>
                            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                                {data.instrucao}
                            </Typography>
                        </Paper>

                        <Grid container spacing={4}>
                            < Grid size={{ xs:6 }}>
                                <Typography variant="h6" sx={{mb: 2}}>Personagens</Typography>
                                {(relacionarData.characters || []).map((char: Character) => (
                                    <DroppableCharacter
                                        key={char.id}
                                        char={char}
                                        quote={containers[char.id] ? containers[char.id][0] : undefined}
                                        onRemoveQuote={handleRemoveQuote}
                                    />
                                ))}
                            </Grid>
                            <Grid size={{ xs:6 }}>
                                <DroppableColumn id="unassigned" title="Falas" items={containers.unassigned || []} />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 3 }}>
                            Verificar
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
