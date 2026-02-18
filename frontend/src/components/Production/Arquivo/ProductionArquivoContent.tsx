
import { Box, Typography, Button, TextareaAutosize, styled, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useModule, ItemType } from '../../../contexts/ModuleContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactMarkdown from 'react-markdown';

const Dropzone = styled('div')<{isDragActive: boolean}>(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[700]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#1a1a1a',
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
    const { markItemAsCompleted, handleNextItem } = useModule();
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
        await markItemAsCompleted(data.id, ItemType.PRODUCTION);
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '90%' }}>
        <Box sx={{ color: '#e0e0e0' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Arquivo</Typography>
          <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
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
                    <Typography variant="h6" sx={{ color: 'lightgreen', mt: 2 }}>{file.name}</Typography>
                ) : isDragActive ? (
                    <Typography variant="h6" sx={{ color: '#007aff', mt: 2 }}>Solte o arquivo aqui!</Typography>
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
                backgroundColor: '#1a1a1a',
                color: '#e0e0e0',
                border: `2px solid ${checkStatus === 'incorrect' ? 'red' : '#282828'}`,
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '16px'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {checkStatus === 'unchecked' && <Button variant="contained" size="large" onClick={handleCheckAnswer} disabled={!file} sx={{ textTransform: 'none', borderRadius: 3 }}>Enviar Desafio</Button>}
            {checkStatus === 'correct' && <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none' }}>Próximo</Button>}
            {checkStatus === 'incorrect' && <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Tentar Novamente</Button>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
