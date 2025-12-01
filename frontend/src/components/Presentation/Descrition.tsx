
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useModule } from '../../contexts/ModuleContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function Descrition() {
    const { activeItem, modulo, allItems, setActiveItem, markItemAsCompleted } = useModule();
    const { user } = useAuth();

    if (!activeItem) {
        return null;
    }

    let title = '';
    let description = '';

    switch(activeItem.type) {
        case 'presentation':
            title = `Sobre o conteúdo`;
            description = (activeItem.data as any).transcricao || 'Nenhuma descrição disponível.';
            break;
        // case 'practice':
        //     title = `Instruções da Prática`;
        //     description = activeItem.data.instrucao;
        //     break;
        // case 'production':
        //     title = `Instruções do Desafio`;
        //     description = (activeItem.data as any).instrucaoDesafio;
        //     break;
        default:
            return null;
    }

    const currentItemIndex = allItems.findIndex(item => item.type === activeItem.type && item.data.id === activeItem.data.id);
    const hasNextItem = currentItemIndex !== -1 && currentItemIndex < allItems.length - 1;

    const handleNext = () => {
        markItemAsCompleted(`${activeItem.type}-${activeItem.data.id}`);

        if (hasNextItem) {
            setActiveItem(allItems[currentItemIndex + 1]);
        } else {
            // This is the last item, conclude the module
            if (user && modulo) {
                api.put(`/progresso/concluir?alunoId=${user.id}&moduloId=${modulo.id}`)
                    .then(() => {
                        console.log('Module concluded');
                        // Optionally, you could navigate away or show a completion message
                    })
                    .catch(error => {
                        console.error("Failed to conclude module:", error);
                    });
            }
        }
    };

  return (
    <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2, whiteSpace: 'pre-wrap' }}>
        {description}
      </Typography>
      
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={handleNext}
        sx={{
          backgroundColor: '#007aff',
          '&:hover': { backgroundColor: '#0056b3' },
          borderRadius: '14px',
          alignSelf: 'flex-end',
          textTransform: 'none',
          fontSize: '16px',
          mt: 2
        }}
      >
        {hasNextItem ? 'Próximo' : 'Concluir Módulo'}
      </Button>
    </Box>
  );
}
