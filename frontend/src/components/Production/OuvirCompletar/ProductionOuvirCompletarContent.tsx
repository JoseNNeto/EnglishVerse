


import { Box, Typography, Button, Paper, LinearProgress, TextField } from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { useState } from 'react';

import { useModule } from '../../../contexts/ModuleContext';

import { useAuth } from '../../../contexts/AuthContext';

import api from '../../../services/api';







interface ProductionOuvirCompletarContentProps {



    data: {



        id: number;



        instrucaoDesafio: string;



        midiaDesafioUrl?: string;



        dadosDesafio: Record<string, any>;



    };



    isLast?: boolean;



}







interface OuvirCompletarData {

    imageUrl: string;

    blankPositions: { top: number; left: number; width: number; }[];

}



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

        return null;

    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;

};



export default function ProductionOuvirCompletarContent({ data, isLast }: ProductionOuvirCompletarContentProps) {



    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo } = useModule();



    const { user } = useAuth();



    const ouvirCompletarData = data.dadosDesafio as OuvirCompletarData;



    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');



    const [answers, setAnswers] = useState<string[]>(Array(ouvirCompletarData.blankPositions?.length || 0).fill(''));







    const handleAnswerChange = (index: number, value: string) => {



        const newAnswers = [...answers];



        newAnswers[index] = value;



        setAnswers(newAnswers);



    };







    const handleNext = () => {



        if (!activeItem) return;



        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);



        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;



        if (hasNextItem) {



            setActiveItem(allItems[currentItemIndex + 1]);



        } else {



            if (user && modulo) {



                api.put(`/progresso/concluir?alunoId=${user.id}&moduloId=${modulo.id}`).catch(console.error);



            }



        }



    };







    const handleSubmit = () => {



        if (answers.some(ans => ans.trim() === '') || !activeItem) return;



        markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);



        handleNext();



    };







  return (



    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>



      <Box sx={{ width: '100%' }}>



        <Box sx={{ color: '#e0e0e0' }}>







          <Typography variant="h4">Etapa: Desafio de Produção - Ouvir e Completar</Typography>



          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>



              <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>



          </Box>



          <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />







          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>



            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>



              {data.instrucaoDesafio}



            </Typography>



          </Box>







          {data.midiaDesafioUrl && (



            <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>



              <Typography variant="h6">Áudio/Vídeo do Desafio</Typography>



              <Typography variant="body2" sx={{color: '#b3b3b3'}}>Ouça com atenção para completar as falas.</Typography>



              



              {embedUrl ? (



                 <Box sx={{



                    position: 'relative',



                    paddingTop: '28.125%',



                    borderRadius: '14px',



                    overflow: 'hidden',



                    mb: 3,



                    width: '50%'



                }}>



                    <iframe



                        width="100%"



                        height="100%"



                        src={embedUrl}



                        title="YouTube video player"



                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"



                        referrerPolicy="strict-origin-when-cross-origin"



                        allowFullScreen



                        style={{ position: 'absolute', top: 0, left: 0 }}



                    ></iframe>



                </Box>



              ) : (



                <audio controls src={data.midiaDesafioUrl} style={{width: '100%'}}>



                    Seu navegador não suporta o elemento de audio.



                </audio>



              )}



            </Paper>



          )}







          {ouvirCompletarData.imageUrl && (



            <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3, position: 'relative' }}>



              <Box



                  component="img"



                  src={ouvirCompletarData.imageUrl}



                  alt="Comic strip"



                  sx={{



                      width: '100%',



                      height: 'auto',



                      borderRadius: '10px',



                      display: 'block',



                  }}



              />



              {ouvirCompletarData.blankPositions && ouvirCompletarData.blankPositions.map((pos, index) => (



                <TextField



                    key={index}



                    placeholder={`Fale ${index + 1}...`}



                    variant="outlined"



                    value={answers[index]}



                    onChange={(e) => handleAnswerChange(index, e.target.value)}



                    sx={{



                        position: 'absolute', 



                        top: pos.top, 



                        left: pos.left, 



                        width: pos.width, 



                        bgcolor: 'rgba(0,0,0,0.3)', 



                        '& .MuiOutlinedInput-root': {



                            '& fieldset': {borderColor: '#b3b3b3'}, 



                            borderRadius: '10px',



                            height: '44px'



                        },



                        '& .MuiInputBase-input': {



                          p: '8px 16px',



                        },



                        transform: 'translate(-50%, -50%)'



                    }}



                />



              ))}



            </Paper>



          )}



          



          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>



            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>Balões preenchidos: {answers.filter(ans => ans && ans.length > 0).length} / {answers.length}</Typography>



            <Typography variant="body2" sx={{ color: '#007aff' }}>0%</Typography>



          </Box>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>



            <Button 



                variant="contained" 



                size="large" 



                sx={{ textTransform: 'none', borderRadius: 3 }}



                onClick={handleSubmit}



                disabled={answers.some(ans => ans.trim() === '')}



            >



              {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}



            </Button>
         </Box>
        </Box>
      </Box>
    </Box>
  );
}
