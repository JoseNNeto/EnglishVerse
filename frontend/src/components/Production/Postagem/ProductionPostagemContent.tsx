
import { Box, Typography, Paper, LinearProgress, Button, TextareaAutosize, styled } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { useModule } from '../../../contexts/ModuleContext';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

const Dropzone = styled('div')<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[700]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isDragActive ? 'rgba(0, 122, 255, 0.1)' : '#1a1a1a',
    transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
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
    isLast?: boolean;
}

interface PostagemData {
    link_externo?: string;
    formatos_aceitos?: string[];
    minWords?: number;
}


export default function ProductionPostagemContent({ data, isLast }: ProductionPostagemContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted, modulo } = useModule();
    const { user } = useAuth();
    const postagemData = data.dadosDesafio as PostagemData;
    const [text, setText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minWords = postagemData.minWords || 10;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragActivity = (e: DragEvent<HTMLDivElement>, isActive: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(isActive);
    };

    const handleDropzoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleNext = () => {
        if (!activeItem) return;
        const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
        const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;
        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        } else {
            if (user && modulo) {
                api.put(`/api/progresso/concluir?alunoId=${user.id}&moduloId=${modulo.id}`).catch(console.error);
            }
        }
    };

    const handleSubmit = () => {
        if (!selectedFile || wordCount < minWords || !activeItem) return;
        markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
        handleNext();
    };


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ color: '#e0e0e0' }}>

                    <Typography variant="h4">Etapa: Desafio de Produção - Foto e Texto</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            {data.instrucaoDesafio}
                        </Typography>
                    </Box>

                    {postagemData.link_externo && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Site Sugerido</Typography>
                            <Button
                                variant="outlined"
                                href={postagemData.link_externo}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visitar
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 1 }}>Sua Imagem:</Typography>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept={postagemData.formatos_aceitos?.join(',')}
                        />
                        <Dropzone
                            isDragActive={isDragActive}
                            onClick={handleDropzoneClick}
                            onDrop={handleDrop}
                            onDragOver={(e) => handleDragActivity(e, true)}
                            onDragEnter={(e) => handleDragActivity(e, true)}
                            onDragLeave={(e) => handleDragActivity(e, false)}
                        >
                            {selectedFile ? (
                                <>
                                    <InsertDriveFileIcon sx={{ fontSize: 64, color: '#007aff' }} />
                                    <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>
                                        {selectedFile.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                                        ({(selectedFile.size / 1024).toFixed(2)} KB)
                                    </Typography>
                                    <Button component="span" sx={{ color: '#007aff', textTransform: 'none', mt: 1 }}>
                                        Clique para trocar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <UploadFileIcon sx={{ fontSize: 64, color: '#b3b3b3' }} />
                                    <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>
                                        Arraste e solte sua imagem aqui
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                                        ou <Button component="span" sx={{ color: '#007aff', textTransform: 'none' }}>clique para procurar</Button>
                                    </Typography>
                                </>
                            )}
                            {postagemData.formatos_aceitos && !selectedFile && (
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
                                padding: '8px 16px',
                                fontFamily: 'inherit',
                                fontSize: '16px'
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
                            <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Mínimo de {minWords} palavras</Typography>
                            <Typography variant="caption" sx={{ color: wordCount >= minWords ? 'lightgreen' : '#b3b3b3' }}>{wordCount}/{minWords} palavras</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{ textTransform: 'none', borderRadius: 3 }} 
                            onClick={handleSubmit}
                            disabled={!selectedFile || wordCount < minWords}
                        >
                            {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
