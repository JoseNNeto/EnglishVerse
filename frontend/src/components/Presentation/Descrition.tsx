import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useModule } from '../../contexts/ModuleContext';

export default function Descrition() {
    const { activeItem, modulo } = useModule();

    if (!activeItem) {
        return null;
    }

    let title = '';
    let description = '';

    switch(activeItem.type) {
        case 'presentation':
            // For presentations, show the transcription as requested
            title = `Transcrição da Apresentação`;
            description = (activeItem.data as any).transcricao || 'Nenhuma transcrição disponível.';
            break;
        case 'practice':
            title = `Instruções da Prática`;
            description = activeItem.data.instrucao;
            break;
        case 'production':
            title = `Instruções do Desafio`;
            description = activeItem.data.instrucaoDesafio;
            break;
        default:
            return null; // Don't render for unknown types
    }


  return (
    <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2, whiteSpace: 'pre-wrap' }}>
        {description}
      </Typography>
    </Box>
  );
}
