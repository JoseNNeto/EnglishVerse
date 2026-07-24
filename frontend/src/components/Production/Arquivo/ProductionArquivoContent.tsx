
import { Box, Typography, Button, TextareaAutosize, styled, Paper, useTheme } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useModule } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

const Dropzone = styled('div')<{isDragActive: boolean}>(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[700]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: theme.palette.mode === 'light' ? '#1B2A4A' : '#282828',
    transition: 'border-color 0.2s ease-in-out',
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
}));

interface ProductionArquivoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface ArquivoData {
    formatos_aceitos?: string[];
}

export default function ProductionArquivoContent({ data }: ProductionArquivoContentProps) {
    const theme = useTheme();
    const { submitProduction, handleNextItem } = useModule();
    const arquivoData = data.dadosDesafio as ArquivoData;

    const [comment, setComment] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');

    useEffect(() => {
        setComment('');
        setFile(null);
        setCheckStatus('unchecked');
    }, [data.id]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // accept: // Logic to create accept object from string array
        multiple: false,
    });
    
    const handleCheckAnswer = async () => {
        if (file === null) {
            setCheckStatus('incorrect');
            return;
        }
        setCheckStatus('correct');
        await submitProduction(data.id, { nomeArquivoOriginal: file.name }, file);
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Etapa: <i>Production Challenge - File Upload</i></Typography>
          <Paper sx={{ bgcolor: '#bd527d', p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              <ReactMarkdown>{data.instrucaoDesafio}</ReactMarkdown>
            </Typography>
          </Paper>

          <Box sx={{ mb: 3 }}>
            <Dropzone {...getRootProps()} isDragActive={isDragActive}>
              <input {...getInputProps()} />
              <UploadFileIcon sx={{ fontSize: 64, color: '#b3b3b3' }} />
               {file ? (
                    <Typography variant="h6" sx={{ color: '#a8c97f', mt: 2 }}>{file.name}</Typography>
                ) : isDragActive ? (
                    <Typography variant="h6" sx={{ color: '#75c3ff', mt: 2 }}>Solte o arquivo aqui!</Typography>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>Arraste e solte seu arquivo aqui</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>ou clique para procurar</Typography>
                    </>
                )}
              {arquivoData.formatos_aceitos && (
                <Typography variant="caption" sx={{ color: '#b3b3b3', mt: 2 }}>
                  Formatos aceitos: {arquivoData.formatos_aceitos.join(', ')}
                </Typography>
              )}
            </Dropzone>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#e0e0e0', mb: 1 }}>Adicionar um comentário (opcional)</Typography>
            <TextareaAutosize
              minRows={4}
              placeholder="Explique brevemente seu arquivo aqui..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: theme.palette.mode === 'light' ? '#456379' : '#000000',
                color: '#b3b3b3',
                border: `2px solid ${checkStatus === 'incorrect' ? '#8b2020' : '#282828'}`,
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '16px'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {checkStatus === 'unchecked' && <Button variant="contained" size="large" onClick={handleCheckAnswer} disabled={!file} sx={{ textTransform: 'none', borderRadius: 3 }}>Enviar Desafio</Button>}
            {checkStatus === 'correct' && <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: '#a8c97f', color: 'white', textTransform: 'none' }}>Próximo</Button>}
            {checkStatus === 'incorrect' && <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: '#8b2020', color: 'white', textTransform: 'none' }}>Tentar Novamente</Button>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
