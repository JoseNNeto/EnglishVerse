
import { Box, Typography, Paper, Button, TextareaAutosize, styled } from '@mui/material';
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

interface ProductionPostagemContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        dadosDesafio: Record<string, any>;
        modulo?: { id: number; };
        moduloId?: number;
    };
}

interface PostagemData {
    link_externo?: string;
    formatos_aceitos?: string[];
    minWords?: number;
}

export default function ProductionPostagemContent({ data }: ProductionPostagemContentProps) {
    const { markItemAsCompleted, handleNextItem } = useModule();
    const postagemData = data.dadosDesafio as PostagemData;

    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [checkStatus, setCheckStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');

    useEffect(() => {
        setText('');
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
        accept: postagemData.formatos_aceitos ? postagemData.formatos_aceitos.reduce((acc, ext) => ({ ...acc, [`image/${ext}`]: [`.${ext}`] }), {}) : undefined,
        multiple: false,
    });

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minWords = postagemData.minWords || 10;
    
    const isSubmittable = file !== null && wordCount >= minWords;

    const handleCheckAnswer = async () => {
        if (!isSubmittable) {
            setCheckStatus('incorrect');
            return;
        }
        setCheckStatus('correct');
        await markItemAsCompleted(data.id, ItemType.PRODUCTION);
        // In a real app, you would upload the file and text here.
    };

    const handleTryAgain = () => {
        setCheckStatus('unchecked');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ color: '#e0e0e0' }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>Etapa: Desafio de Produção - Foto e Texto</Typography>

                    <Paper sx={{ bgcolor: '#1a1a1a', p: 3, borderRadius: 3, mb: 3 }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>Seu Desafio</Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            <ReactMarkdown>{data.instrucaoDesafio}</ReactMarkdown>
                        </Typography>
                        {postagemData.link_externo && (
                            <Button variant="outlined" sx={{mt: 2}} href={postagemData.link_externo} target="_blank">
                                Ir para o site sugerido
                            </Button>
                        )}
                    </Paper>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Sua Imagem:</Typography>
                        <Dropzone {...getRootProps()} isDragActive={isDragActive}>
                            <input {...getInputProps()} />
                            <UploadFileIcon sx={{ fontSize: 64, color: '#b3b3b3' }} />
                            {file ? (
                                <Typography variant="h6" sx={{ color: 'lightgreen', mt: 2 }}>{file.name}</Typography>
                            ) : isDragActive ? (
                                <Typography variant="h6" sx={{ color: '#007aff', mt: 2 }}>Solte a imagem aqui!</Typography>
                            ) : (
                                <>
                                    <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>Arraste e solte sua imagem aqui</Typography>
                                    <Typography variant="body1" sx={{ color: '#b3b3b3' }}>ou clique para procurar</Typography>
                                </>
                            )}
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
                            placeholder="Explique em inglês aqui..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{
                                width: '100%',
                                backgroundColor: '#1a1a1a',
                                color: '#e0e0e0',
                                border: `2px solid ${checkStatus === 'incorrect' && wordCount < minWords ? 'red' : '#282828'}`,
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

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        {checkStatus === 'unchecked' && <Button variant="contained" size="large" onClick={handleCheckAnswer} disabled={!isSubmittable} sx={{ textTransform: 'none', borderRadius: 3 }}>Enviar Desafio</Button>}
                        {checkStatus === 'correct' && <Button variant="contained" onClick={handleNextItem} endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'green', color: 'white', textTransform: 'none' }}>Próximo</Button>}
                        {checkStatus === 'incorrect' && <Button variant="contained" onClick={handleTryAgain} sx={{ bgcolor: 'red', color: 'white', textTransform: 'none' }}>Tentar Novamente</Button>}
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
