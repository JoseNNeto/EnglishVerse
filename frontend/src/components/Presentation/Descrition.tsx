import { Box, Typography } from '@mui/material';
import { useModule } from '../../contexts/ModuleContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function Descrition() {
    const { activeItem } = useModule();

    if (!activeItem) {
        return null;
    }

    let description = '';

    switch(activeItem.type) {
        case 'presentation':
            // For presentations, show the transcription as requested
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            description = (activeItem.data as any).transcricao || 'Nenhuma transcrição disponível.';
            break;
        default:
            return null; // Don't render for unknown types
    }


  return (
    <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3, width: '100%' }}>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{description}</ReactMarkdown>
      </Typography>
    </Box>
  );
}
