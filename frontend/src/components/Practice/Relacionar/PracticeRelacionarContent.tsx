
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable, type UniqueIdentifier, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useMemo, useEffect } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PracticeRelacionarContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface RelacionarData {
    video_url: string;
    quotes: { id: string; text: string; }[];
    characters: { id: string; name: string; }[];
    resposta_correta: Record<string, string>; // quote.id -> character.id
}

interface Character {
    id: string;
    name: string;
}

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId;
    try {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || urlObj.pathname.slice(1);
    } catch (e) { return null; }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

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

function DroppableCharacter({ char, quote, onRemoveQuote, status }: { char: Character, quote?: { id: UniqueIdentifier, text: string }, onRemoveQuote: Function, status: 'correct' | 'incorrect' | 'default' }) {
    const { setNodeRef, isOver } = useDroppable({ id: char.id });
    const borderColor = status === 'correct' ? 'green' : status === 'incorrect' ? 'red' : '#b3b3b3';
    return (
        <Paper ref={setNodeRef} sx={{ p: 2, mb: 2, bgcolor: isOver ? '#333' : '#1a1a1a', border: `1px solid ${borderColor}`, transition: 'background-color 0.2s, border-color 0.2s' }}>
            <Typography sx={{ color: '#007aff', mb: 1 }}>{char.name}</Typography>
            <Box 
                sx={{ border: `2px dashed ${borderColor}`, borderRadius: 2, p: 2, minHeight: 60, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => quote && onRemoveQuote(quote.id, char.id)}
            >
                {quote ? <Typography sx={{ color: '#e0e0e0', cursor: 'pointer' }}>{quote.text}</Typography> : <Typography sx={{ color: '#b3b3b3' }}>Solte o rótulo aqui</Typography>}
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
    const { markItemAsCompleted, handleNextItem } = useModule();
    const relacionarData = data.dadosAtividade as RelacionarData;

    const initialContainers = useMemo(() => ({
        unassigned: relacionarData.quotes || [],
        ...(relacionarData.characters || []).reduce((acc, char) => ({ ...acc, [char.id]: [] }), {})
    }), [relacionarData.quotes, relacionarData.characters]);

    const [containers, setContainers] = useState<Record<string, { id: UniqueIdentifier, text: string }[]>>(initialContainers);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | 'default'>>({});

    useEffect(() => {
        setContainers(initialContainers);
        setCheckStatus('unchecked');
        setFeedback({});
    }, [data.id, initialContainers]);

    const sensors = useSensors(useSensor(PointerSensor));

    const findContainer = (id: UniqueIdentifier) => Object.keys(containers).find(key => containers[key].some(item => item.id === id) || key === id);
    
    const handleDragStart = (event: DragStartEvent) => checkStatus === 'unchecked' && setActiveId(event.active.id);

    const handleDragEnd = (event: DragEndEvent) => {
        if (checkStatus !== 'unchecked') return;
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        const originalContainerId = findContainer(active.id);
        const overContainerId = findContainer(over.id);
        if (!originalContainerId || !overContainerId || originalContainerId === overContainerId) return;

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
        if (checkStatus !== 'unchecked') return;
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
    };

    const handleCheckAnswer = async () => {
        const correctAnswers = relacionarData.resposta_correta;
        const newFeedback: Record<string, 'correct' | 'incorrect' | 'default'> = {};
        let allCorrect = true;

        Object.keys(correctAnswers).forEach(quoteId => {
            const correctCharId = correctAnswers[quoteId];
            const userCharContainer = Object.keys(containers).find(charId => containers[charId].some(q => q.id === quoteId));
            
            if (userCharContainer === correctCharId) {
                newFeedback[correctCharId] = 'correct';
            } else {
                if(userCharContainer && userCharContainer !== 'unassigned') newFeedback[userCharContainer] = 'incorrect';
                allCorrect = false;
            }
        });
        
        if (Object.keys(containers).some(key => key !== 'unassigned' && containers[key].length === 0)) {
           allCorrect = false;
        }

        setFeedback(newFeedback);
        setCheckStatus(allCorrect ? 'correct' : 'incorrect');

        if (allCorrect) {
            await markItemAsCompleted(data.id, ItemType.PRACTICE);
        }
    };
    
    const handleTryAgain = () => {
        setContainers(initialContainers);
        setCheckStatus('unchecked');
        setFeedback({});
    };

    const embedUrl = getYouTubeEmbedUrl(relacionarData.video_url);
    const activeQuote = activeId ? Object.values(containers).flat().find(q => q.id === activeId) : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" sx={{ mb: 1, color: 'white' }}>Etapa: Practice - Match</Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#b3b3b3' }}>{data.instrucao}</Typography>
                
                {embedUrl && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative', paddingTop: '40%', borderRadius: '14px', overflow: 'hidden', width: '70%'}}>
                            <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
                        </Box>
                    </Box>
                )}

                <Grid container spacing={4}>
                    <Grid size={{ xs:6 }}>
                        <Typography variant="h6" sx={{mb: 2, color: 'white'}}>Personagens</Typography>
                        {(relacionarData.characters || []).map((char: Character) => (
                            <DroppableCharacter
                                key={char.id}
                                char={char}
                                quote={containers[char.id]?.[0]}
                                onRemoveQuote={handleRemoveQuote}
                                status={feedback[char.id] || 'default'}
                            />
                        ))}
                    </Grid>
                    <Grid size={{ xs:6 }}>
                        <DroppableColumn id="unassigned" title="Rótulos" items={containers.unassigned || []} />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                    {checkStatus === 'unchecked' && <Button variant="contained" size="large" onClick={handleCheckAnswer} sx={{ textTransform: 'none', borderRadius: 3 }}>Verificar</Button>}
                    {checkStatus === 'correct' && <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none' }}>Próximo</Button>}
                    {checkStatus === 'incorrect' && <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Tentar Novamente</Button>}
                </Box>
            </Box>
            <DragOverlay>
                {activeQuote ? <DraggableQuote id={activeQuote.id} text={activeQuote.text} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
