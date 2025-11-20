
import { Box, Typography, Paper, LinearProgress, Button, TextareaAutosize, styled } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

export default function ProductionPostagemContent() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '90%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Atividade 3 de 7</Typography>
                            <Typography sx={{ color: '#b3b3b3' }}>42%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={42} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa 3: Desafio de Produção</Typography>
                    
                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box component="img" src="https://www.figma.com/api/mcp/asset/b3332391-101c-42aa-bf48-cfc7ae00f73a" alt="Album Art" sx={{ width: 96, height: 96, borderRadius: '10px' }}/>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ color: '#e0e0e0' }}>Imagine</Typography>
                            <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 1 }}>John Lennon</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button sx={{ borderRadius: '50%', minWidth: 48, minHeight: 48, bgcolor: '#007aff', '&:hover': { bgcolor: '#006edb' } }}>
                                    <PlayArrowIcon sx={{ color: 'white' }} />
                                </Button>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4, bgcolor: '#282828' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>1:23</Typography>
                                        <Typography variant="caption" sx={{ color: '#b3b3b3' }}>3:03</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio: O Meme Crítico</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                        Inspirado na música que você ouviu, encontre na internet (ou crie o seu!) um meme ou uma imagem que represente a mensagem da letra. Faça o upload da imagem e escreva um parágrafo em inglês explicando a piada ou a conexão.
                        </Typography>
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
                            <Typography variant="caption" sx={{ color: '#b3b3b3', mt: 2 }}>
                                Formatos aceitos: PNG, JPG, JPEG
                            </Typography>
                        </Dropzone>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Explique sua imagem:</Typography>
                        <TextareaAutosize
                            minRows={6}
                            placeholder="Este meme se conecta com a música porque..."
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
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Mínimo de 50 palavras</Typography>
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>0/50 palavras</Typography>
                        </Box>
                    </Box>

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
