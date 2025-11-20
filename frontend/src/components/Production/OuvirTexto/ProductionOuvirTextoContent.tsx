
import { Box, Typography, Paper, LinearProgress, Button, TextareaAutosize } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function ProductionOuvirTextoContent() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Box sx={{ width: '90%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Atividade 4 de 7</Typography>
                            <Typography sx={{ color: '#b3b3b3' }}>57%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={57} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa 3: Desafio de Produção</Typography>
                    
                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6">Historic Speech: A Vision for Tomorrow</Typography>
                        <Typography variant="body2" sx={{color: '#b3b3b3'}}>Dr. Sarah Mitchell, 1995</Typography>
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button sx={{ borderRadius: '50%', minWidth: 48, minHeight: 48, bgcolor: '#007aff', '&:hover': { bgcolor: '#006edb' } }}>
                                <PlayArrowIcon sx={{ color: 'white' }} />
                            </Button>
                            <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4, bgcolor: '#282828' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="caption" sx={{ color: '#b3b3b3' }}>2:15</Typography>
                                    <Typography variant="caption" sx={{ color: '#b3b3b3' }}>5:30</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio: Completar o Discurso</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                        Ouça o discurso com atenção. Abaixo está a transcrição, mas algumas partes importantes foram removidas. Preencha as lacunas com parágrafos curtos, usando suas próprias palavras, para completar o sentido do texto.
                        </Typography>
                    </Paper>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 4, borderRadius: 3, mb: 3 }}>
                        <Typography variant="body1" sx={{mb: 2}}>
                        "We stand today at the crossroads of history. Our generation has been given a unique opportunity to reshape the future of education. We have witnessed how knowledge can transform lives, how learning can break barriers, and how understanding can bridge divides between different cultures and communities."
                        </Typography>
                        
                        <Box sx={{mb: 2}}>
                            <Typography variant="caption" sx={{color: '#b3b3b3', mb: 1}}>Lacuna 1: Descreva por que a educação é importante para quebrar barreiras (em inglês)</Typography>
                            <TextareaAutosize minRows={3} placeholder="Education is important because..." style={{ width: '100%', backgroundColor: '#121212', color: '#e0e0e0', border: '2px solid #282828', borderRadius: '14px', padding: '16px', fontFamily: 'inherit', fontSize: '16px' }}/>
                        </Box>

                        <Typography variant="body1" sx={{mb: 2}}>
                        "Every student deserves access to quality education, regardless of their background or circumstances. When we invest in learning, we invest in hope. When we open doors to knowledge, we create pathways to opportunities that were once unimaginable."
                        </Typography>

                        <Box sx={{mb: 2}}>
                            <Typography variant="caption" sx={{color: '#b3b3b3', mb: 1}}>Lacuna 2: Que tipo de oportunidades a educação pode criar? (em inglês)</Typography>
                            <TextareaAutosize minRows={3} placeholder="Education creates opportunities such as..." style={{ width: '100%', backgroundColor: '#121212', color: '#e0e0e0', border: '2px solid #282828', borderRadius: '14px', padding: '16px', fontFamily: 'inherit', fontSize: '16px' }}/>
                        </Box>

                        <Typography variant="body1" sx={{mb: 2}}>
                        "The future belongs to those who believe in the power of their dreams and the strength of their determination. Together, we can build a world where every person has the chance to reach their full potential."
                        </Typography>
                        
                        <Box>
                            <Typography variant="caption" sx={{color: '#b3b3b3', mb: 1}}>Lacuna 3: Como podemos ajudar as pessoas a alcançarem seu potencial? (em inglês)</Typography>
                            <TextareaAutosize minRows={3} placeholder="We can help people reach their potential by..." style={{ width: '100%', backgroundColor: '#121212', color: '#e0e0e0', border: '2px solid #282828', borderRadius: '14px', padding: '16px', fontFamily: 'inherit', fontSize: '16px' }}/>
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
