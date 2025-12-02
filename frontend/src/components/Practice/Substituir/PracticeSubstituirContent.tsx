
import { Box, Typography, Paper, LinearProgress, Button, Menu, MenuItem } from '@mui/material';
import { useState, useMemo } from 'react';

interface PracticeSubstituirContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
    };
}

type TextPart = { type: 'text' | 'word' | 'break' | 'italic', content: string, id?: string };

// Assuming data structure for SUBSTITUIR type in dadosDesafio
interface SubstituirData {
    albumArtUrl: string;
    songTitle: string;
    artistName: string;
    initialText: TextPart[];
    synonyms: Record<string, string[]>;
    midiaUrl?: string;
}

export default function PracticeSubstituirContent({ data }: PracticeSubstituirContentProps) {
    const substituirData = data.dadosAtividade as SubstituirData;
    const initialText = useMemo(() => substituirData.initialText || [], [substituirData.initialText]);
    const synonyms = useMemo(() => substituirData.synonyms || {}, [substituirData.synonyms]);

    const [textParts, setTextParts] = useState<TextPart[]>(initialText);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

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
        }
        handleClose();
    };

    const replacedCount = textParts.filter((p) => {
        const initialPart = initialText.find(initP => initP.id === p.id);
        return p.type === 'word' && initialPart && p.content !== initialPart.content;
    }).length;

    const totalReplaceable = initialText.filter(p => p.type === 'word').length;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '90%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
                        </Box>
                        <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Prática - Substituir</Typography>
                    
                    {substituirData.midiaUrl && (
                        <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box component="img" src={substituirData.albumArtUrl} alt="Album Art" sx={{ width: 128, height: 128, borderRadius: '10px' }}/>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" sx={{ color: '#e0e0e0' }}>{substituirData.songTitle}</Typography>
                                <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>{substituirData.artistName}</Typography>
                                <audio controls src={substituirData.midiaUrl} style={{width: '100%'}}>
                                    Seu navegador não suporta o elemento de áudio.
                                </audio>
                            </Box>
                        </Paper>
                    )}

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Sua Prática</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucao}
                        </Typography>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                        <Typography variant="body1" component="div">
                            {textParts.map((part, index) => {
                                if (part.type === 'text') return <span key={index}>{part.content}</span>;
                                if (part.type === 'italic') return <i key={index}>{part.content}</i>;
                                if (part.type === 'break') return <br key={index} />;
                                if (part.type === 'word' && part.id) return (
                                    <Button key={index} onClick={(e) => handleClick(e, part.id!)} sx={{textTransform: 'none', color: '#007aff', p:0, minWidth: 'auto', display: 'inline', fontStyle: 'italic', fontSize: 'inherit', fontFamily: 'inherit' }}>
                                        {part.content}
                                    </Button>
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

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 3 }}>
                        Verificar
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
