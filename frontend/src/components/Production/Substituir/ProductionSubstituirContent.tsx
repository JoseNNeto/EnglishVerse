import { Box, Typography, Paper, LinearProgress, Button, Menu, MenuItem } from '@mui/material';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModule } from '../../../contexts/ModuleContext';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

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

interface ProductionSubstituirContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
    isLast?: boolean;
}

type TextPart = { type: 'text' | 'word' | 'break' | 'italic', content: string, id?: string };
type VerificationStatus = 'correct' | 'incorrect' | 'idle';

interface SubstituirData {
    albumArtUrl: string;
    songTitle: string;
    artistName: string;
    initialText: TextPart[];
    synonyms: Record<string, string[]>;
    correctAnswers: Record<string, string>;
}

export default function ProductionSubstituirContent({ data, isLast }: ProductionSubstituirContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo } = useModule();
    const { user } = useAuth();
    const navigate = useNavigate();
    const substituirData = data.dadosDesafio as SubstituirData;
    const initialText = useMemo(() => substituirData.initialText || [], [substituirData.initialText]);
    const synonyms = useMemo(() => substituirData.synonyms || {}, [substituirData.synonyms]);

    const [textParts, setTextParts] = useState<TextPart[]>(initialText);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<Record<string, VerificationStatus>>({});

    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');

    const handleClick = (event: React.MouseEvent<HTMLElement>, wordId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedWordId(wordId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedWordId(null);
    };
    
    const handleSelectSynonym = (synonym: string) => {
        if (selectedWordId) {
            setTextParts(prev => prev.map(part => {
                if (part.type === 'word' && part.id === selectedWordId) {
                    return { ...part, content: synonym };
                }
                return part;
            }));
            setVerificationStatus(prev => ({...prev, [selectedWordId]: 'idle'}));
        }
        handleClose();
    };

    const replacedCount = textParts.filter((p, i) => {
        const initialPart = initialText.find(initP => initP.id === p.id);
        return p.type === 'word' && initialPart && p.content !== initialPart.content;
    }).length;

    const totalReplaceable = initialText.filter(p => p.type === 'word').length;

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
        if (!activeItem) return;

        const { correctAnswers } = substituirData;
        const newStatus: Record<string, VerificationStatus> = {};
        let allSubstitutionsCorrect = true;

        initialText.forEach(initialPart => {
            if (initialPart.type === 'word' && initialPart.id) {
                const currentUserChoice = textParts.find(p => p.id === initialPart.id && p.type === 'word')?.content;
                const expectedCorrectAnswer = correctAnswers[initialPart.id];

                if (currentUserChoice && currentUserChoice === expectedCorrectAnswer) {
                    newStatus[initialPart.id] = 'correct';
                } else {
                    newStatus[initialPart.id] = 'incorrect';
                    allSubstitutionsCorrect = false;
                }
            }
        });
        
        setVerificationStatus(newStatus);

        if (allSubstitutionsCorrect) {
            setTimeout(() => {
                markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
                handleNext();
            }, 1000);
        }
    };

    const getWordColor = (wordId: string): string => {
        const status = verificationStatus[wordId] || 'idle';
        switch (status) {
            case 'correct':
                return 'lightgreen';
            case 'incorrect':
                return 'red';
            case 'idle':
            default:
                return '#007aff';
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ color: '#e0e0e0' }}>
                    <Typography variant="h4">Etapa: Desafio de Produção - Substituir</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucaoDesafio}
                        </Typography>
                    </Box>
                    
                    {embedUrl && (
                        <Box sx={{ position: 'relative', paddingTop: '28%', borderRadius: '14px', overflow: 'hidden', mb: 3, border: '1px solid #282828', width: '40%', margin: '0 auto' }}>
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

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h6" component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                            {textParts.map((part, index) => {
                                if (part.type === 'text') return <span key={index}>{part.content}</span>;
                                if (part.type === 'italic') return <i key={index}>{part.content}</i>;
                                if (part.type === 'break') return <br key={index} />;
                                if (part.type === 'word' && part.id) return (
                                    <span
                                        key={index}
                                        onClick={(e) => handleClick(e, part.id!)}
                                        style={{
                                            color: getWordColor(part.id),
                                            cursor: 'pointer',
                                            fontStyle: 'italic',
                                            textDecoration: 'underline',
                                            fontSize: '1.05em',
                                            transition: 'color 0.3s'
                                        }}
                                    >
                                        {part.content}
                                    </span>
                                );
                                return null;
                            })}
                        </Typography>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            {(selectedWordId && synonyms[selectedWordId]) ? synonyms[selectedWordId].map(synonym => (
                                <MenuItem key={synonym} onClick={() => handleSelectSynonym(synonym)}>{synonym}</MenuItem>
                            )) : <MenuItem disabled>No synonyms found</MenuItem>}
                        </Menu>
                         <Box sx={{ borderTop: 1, borderColor: '#282828', mt: 3, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Palavras substituídas: {replacedCount} / {totalReplaceable}</Typography>
                            <Typography variant="caption" sx={{ color: '#007aff' }}>{ totalReplaceable > 0 ? Math.round((replacedCount / totalReplaceable) * 100) : 0 }%</Typography>
                        </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{ textTransform: 'none', borderRadius: 3 }}
                            onClick={handleSubmit}
                            disabled={replacedCount !== totalReplaceable || totalReplaceable === 0}
                        >
                            {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
