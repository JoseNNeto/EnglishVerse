
import { Box, Typography, Paper, Button, Menu, MenuItem } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface PracticeSubstituirContentProps {
    data: {
        id: number;
        instrucao: string;
        dadosAtividade: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

type TextPart = { type: 'text' | 'word' | 'break' | 'italic', content: string, id?: string };

interface SubstituirData {
    video_url: string;
    initialText: TextPart[];
    synonyms: Record<string, string[]>;
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

export default function PracticeSubstituirContent({ data }: PracticeSubstituirContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const substituirData = data.dadosAtividade as SubstituirData;

    const initialText = useMemo(() => substituirData.initialText || [], [substituirData.initialText]);
    const synonyms = useMemo(() => substituirData.synonyms || {}, [substituirData.synonyms]);

    const [textParts, setTextParts] = useState<TextPart[]>(initialText);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');
    
    useEffect(() => {
        setTextParts(initialText);
        setCheckStatus('unchecked');
    }, [data.id, initialText]);

    const handleClick = (event: React.MouseEvent<HTMLElement>, wordId: string) => {
        if (checkStatus !== 'unchecked') return;
        setAnchorEl(event.currentTarget);
        setSelectedWordId(wordId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedWordId(null);
    };
    
    const handleSelectSynonym = (synonym: string) => {
        if (selectedWordId) {
            setTextParts(prev => prev.map(part => (part.type === 'word' && part.id === selectedWordId) ? { ...part, content: synonym } : part));
        }
        handleClose();
    };

    const replacedCount = useMemo(() => textParts.filter((p, _i) => {
        const initialPart = initialText.find(initP => initP.id === p.id);
        return p.type === 'word' && initialPart && p.content !== initialPart.content;
    }).length, [textParts, initialText]);

    const totalReplaceable = useMemo(() => initialText.filter(p => p.type === 'word').length, [initialText]);

    const handleCheckAnswer = async () => {
        if (replacedCount === totalReplaceable && totalReplaceable > 0) {
            setCheckStatus('correct');
            await markItemAsCompleted(data.id, ItemType.PRACTICE);
        } else {
            setCheckStatus('incorrect');
        }
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
        // Note: We don't reset the text parts, allowing the user to continue from where they left off.
    };

    const embedUrl = getYouTubeEmbedUrl(substituirData.video_url);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 1, color: 'white' }}>Etapa: Prática - Substituir</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 3 }}>{data.instrucao}</Typography>
            
            {embedUrl && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative', paddingTop: '40%', borderRadius: '14px', overflow: 'hidden', width: '70%'}}>
                        <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: 'absolute', top: 0, left: 0 }}></iframe>
                    </Box>
                </Box>
            )}

            <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                <Typography variant="body1" component="div">
                    {textParts.map((part, index) => {
                        if (part.type === 'word' && part.id) return (
                            <Button key={index} onClick={(e) => handleClick(e, part.id!)} sx={{textTransform: 'none', color: '#007aff', p:0, minWidth: 'auto', display: 'inline', fontStyle: 'italic', fontSize: 'inherit', fontFamily: 'inherit' }}>
                                {part.content}
                            </Button>
                        );
                        return <span key={index}>{part.content}</span>;
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                {checkStatus === 'unchecked' && <Button variant="contained" size="large" onClick={handleCheckAnswer} sx={{ textTransform: 'none', borderRadius: 3 }}>Verificar</Button>}
                {checkStatus === 'correct' && <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none' }}>Próximo</Button>}
                {checkStatus === 'incorrect' && <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Tentar Novamente</Button>}
            </Box>
        </Box>
    );
}
