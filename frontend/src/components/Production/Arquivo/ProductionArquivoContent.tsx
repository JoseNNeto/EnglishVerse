
import { Box, Typography, Button, TextareaAutosize, styled, Paper, LinearProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { useModule } from '../../../contexts/ModuleContext';

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

interface ProductionArquivoContentProps {
    data: {
        id: number;
        instrucaoDesafio: string;
        midiaDesafioUrl?: string;
        dadosDesafio: Record<string, any>;
    };
    isLast?: boolean;
}

interface ArquivoData {
    acceptedFormats?: string[];
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

export default function ProductionArquivoContent({ data, isLast }: ProductionArquivoContentProps) {
    const { positionalProgressPercentage, activeItem, allItems, setActiveItem, markItemAsCompleted } = useModule();
    const arquivoData = data.dadosDesafio as ArquivoData;
    const embedUrl = getYouTubeEmbedUrl(data.midiaDesafioUrl || '');
    const [comment, setComment] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        }
    };

    const handleSubmit = () => {
        if (!selectedFile || !activeItem) return;
        markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);
        handleNext();
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ color: '#e0e0e0' }}>

          <Typography variant="h4">Etapa: Desafio de Produção - Arquivo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Typography sx={{ flexGrow: 1, color: '#b3b3b3' }}>Progresso: {Math.round(positionalProgressPercentage)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={positionalProgressPercentage} sx={{ height: 8, borderRadius: 4, mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
              {data.instrucaoDesafio}
            </Typography>
          </Box>

          {embedUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{
                position: 'relative',
                paddingTop: '28.125%', 
                borderRadius: '14px',
                overflow: 'hidden',
                width: '50%',
                maxWidth: 700,
                border: '1px solid #282828',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
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
            </Box>
          )}

          <Box sx={{ mb: 1 }}>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept={arquivoData.acceptedFormats?.map(f => `.${f.toLowerCase()}`).join(',')}
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
                        <Button component="span" sx={{ color: '#007aff', textTransform: 'none', mt:1 }}>
                            Clique para trocar
                        </Button>
                    </>
                ) : (
                    <>
                        <UploadFileIcon sx={{ fontSize: 64, color: '#b3b3b3' }} />
                        <Typography variant="h6" sx={{ color: '#e0e0e0', mt: 2 }}>
                            Arraste e solte seu arquivo aqui
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                            ou <Button component="span" sx={{ color: '#007aff', textTransform: 'none' }}>clique para procurar</Button>
                        </Typography>
                    </>
                )}
                 {arquivoData.acceptedFormats && arquivoData.acceptedFormats.length > 0 && !selectedFile && (
                    <Typography variant="caption" sx={{ color: '#b3b3b3', mt: 2 }}>
                    Formatos aceitos: {arquivoData.acceptedFormats.join(', ').toUpperCase()}
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
                border: '2px solid #282828',
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '16px'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
                variant="contained" 
                size="large" 
                sx={{ textTransform: 'none', borderRadius: 3 }} 
                onClick={handleSubmit}
                disabled={!selectedFile}
            >
              {isLast ? 'Enviar Desafio e concluir módulo' : 'Enviar Desafio'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
