
import { Box, Typography, Paper, LinearProgress, Button, TextareaAutosize, styled } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react';

const Dropzone = styled('div')(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[700]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#1a1a1a',
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
}));

interface ProductionPostagemContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
}

// Assuming data structure for FOTO_E_TEXTO type in dadosDesafio
interface PostagemData {
    link_externo?: string;
    formatos_aceitos?: string[];
    minWords?: number;
}


export default function ProductionPostagemContent({ data }: ProductionPostagemContentProps) {
    const postagemData = data.dadosDesafio as PostagemData;
    const [text, setText] = useState('');
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minWords = postagemData.minWords || 50;


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '90%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: 0%</Typography> {/* Placeholder */}
                        </Box>
                        <LinearProgress variant="determinate" value={0} sx={{ height: 8, borderRadius: 4 }} /> {/* Placeholder */}
                    </Box>

                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Foto e Texto</Typography>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucaoDesafio}
                        </Typography>
                        {postagemData.link_externo && (
                            <Button 
                                variant="outlined" 
                                sx={{mt: 2}} 
                                href={postagemData.link_externo} 
                                target="_blank"
                            >
                                Ir para o site sugerido
                            </Button>
                        )}
                    </Paper>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Sua Imagem:</Typography>
                        <Dropzone>
                            <UploadFileIcon sx={{ fontSize: 64, color: '#b3b3b3' }} />
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>
                                Arraste e solte sua imagem aqui
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                                ou <Button component="span" sx={{ color: '#007aff', textTransform: 'none' }}>clique para procurar</Button>
                            </Typography>
                            {postagemData.formatos_aceitos && (
                                <Typography variant="caption" sx={{ color: '#b3b3b3', mt: 2 }}>
                                    Formatos aceitos: {postagemData.formatos_aceitos.join(', ')}
                                </Typography>
                            )}
                        </Dropzone>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Explique sua imagem:</Typography>
                        <TextareaAutosize
                            minRows={6}
                            placeholder="Este meme se conecta com a música porque..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{
                                width: '100%',
                                backgroundColor: '#1a1a1a',
                                color: '#e0e0e0',
                                border: '2px solid #282828',
                                borderRadius: '14px',
                                padding: '16px',
                                fontFamily: 'inherit',
                                fontSize: '16px'
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Mínimo de {minWords} palavras</Typography>
                            <Typography variant="caption" sx={{ color: wordCount >= minWords ? 'lightgreen' : '#b3b3b3' }}>{wordCount}/{minWords} palavras</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant="contained" size="large" sx={{ textTransform: 'none', borderRadius: 3, opacity: 0.5 }}>
                        Enviar Desafio
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
