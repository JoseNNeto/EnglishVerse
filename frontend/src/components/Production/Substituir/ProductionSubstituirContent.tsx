
import { Box, Typography, Paper, LinearProgress, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const synonyms: Record<string, string[]> = {
    'beautiful': ['lovely', 'gorgeous', 'stunning'],
    'moments': ['instances', 'occasions', 'times'],
    'forever': ['eternally', 'always', 'evermore'],
    'heart': ['soul', 'spirit', 'core'],
};

const initialText = [
    { type: 'text', content: 'When the stars shine bright and the night is young, ' },
    { type: 'word', id: 'beautiful', content: 'beautiful' },
    { type: 'text', content: ' memories fill the air.' },
    { type: 'break' },
    { type: 'text', content: 'We dance through ' },
    { type: 'word', id: 'moments', content: 'moments' },
    { type: 'text', content: ` that we'll treasure, in a world where time stands still.` },
    { type: 'break' },
    { type: 'text', content: 'I promise to love you ' },
    { type: 'word', id: 'forever', content: 'forever' },
    { type: 'text', content: ', with every beat of my ' },
    { type: 'word', id: 'heart', content: 'heart' },
    { type: 'text', content: '.' },
    { type: 'break' },
    { type: 'italic', content: `Together we'll write our story, a tale that will never part.` },
];


export default function ProductionSubstituirContent() {
    const [textParts, setTextParts] = useState(initialText);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>, wordId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedWord(wordId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedWord(null);
    };
    
    const handleSelectSynonym = (synonym: string) => {
        if (selectedWord) {
            setTextParts(prev => prev.map(part => {
                if (part.type === 'word' && part.id === selectedWord) {
                    return { ...part, content: synonym };
                }
                return part;
            }));
        }
        handleClose();
    };

    const replacedCount = textParts.filter((p, i) => p.type === 'word' && p.content !== initialText[i].content).length;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '90%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Atividade 6 de 7</Typography>
                            <Typography sx={{ color: '#b3b3b3' }}>85%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa 3: Desafio de Produção</Typography>
                    
                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box component="img" src="https://www.figma.com/api/mcp/asset/08587642-e2f8-40be-975e-028d931166b3" alt="Album Art" sx={{ width: 128, height: 128, borderRadius: '10px' }}/>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" sx={{ color: '#e0e0e0' }}>When Time Stands Still</Typography>
                            <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>Original Song • 2024</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button sx={{ borderRadius: '50%', minWidth: 48, minHeight: 48, bgcolor: '#007aff', '&:hover': { bgcolor: '#006edb' } }}>
                                    <PlayArrowIcon sx={{ color: 'white' }} />
                                </Button>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4, bgcolor: '#282828' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>1:20</Typography>
                                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>3:45</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio: Enriquecendo o Vocabulário</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                        Ouça a música. Na letra abaixo, clique nas palavras destacadas em azul e substitua cada uma por um sinônimo com o mesmo significado da lista que aparecer.
                        </Typography>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                        <Typography variant="body1" component="div">
                            {textParts.map((part, index) => {
                                if (part.type === 'text') return <span key={index}>{part.content}</span>;
                                if (part.type === 'italic') return <i key={index}>{part.content}</i>;
                                if (part.type === 'break') return <br key={index} />;
                                if (part.type === 'word') return (
                                    <Button key={index} onClick={(e) => handleClick(e, part.id!)} sx={{textTransform: 'none', color: '#007aff', p:0, minWidth: 'auto', display: 'inline', fontStyle: 'italic' }}>
                                        {part.content}
                                    </Button>
                                );
                                return null;
                            })}
                        </Typography>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            {(selectedWord && synonyms[selectedWord]) ? synonyms[selectedWord].map(synonym => (
                                <MenuItem key={synonym} onClick={() => handleSelectSynonym(synonym)}>{synonym}</MenuItem>
                            )) : null}
                        </Menu>
                         <Box sx={{ borderTop: 1, borderColor: '#282828', mt: 3, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Palavras substituídas: {replacedCount} / 4</Typography>
                            <Typography variant="caption" sx={{ color: '#007aff' }}>{ (replacedCount / 4) * 100 }%</Typography>
                        </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 3, opacity: 0.5 }}>
                        Enviar Desafio e Concluir Módulo!
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
