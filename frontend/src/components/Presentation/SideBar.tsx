import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { useModule, ItemType } from '../../contexts/ModuleContext';
import { Link } from 'react-router-dom';

export default function SideBar() {
  const { loading, modulo, allItems, activeItem, completedItems, handleSelectItem } = useModule();

  

  // Moved helper functions inside the component
  const getItemText = (item: (typeof allItems)[number]) => {
    switch(item.type) {
      case 'presentation':
        return `Presentation ${item.data.ordem}: ${item.data.tipoRecurso.charAt(0).toUpperCase() + item.data.tipoRecurso.slice(1).toLowerCase()}`;
      case 'practice':
        switch (item.data.tipoAtividade) {
          case 'MULTIPLA_ESCOLHA':
            return `Practice ${item.data.id}: Multiple Choice`;
          case 'PREENCHER_LACUNA':
            return `Practice ${item.data.id}: Fill in the Blanks`;
          case 'SELECIONAR_PALAVRAS':
            return `Practice ${item.data.id}: Select Words`;
          case 'LISTA_PALAVRAS':
            return `Practice ${item.data.id}: List Words`;
          case 'RELACIONAR_COLUNAS':
            return `Practice ${item.data.id}: Match Columns`;
          case 'SUBSTITUIR_PALAVRAS':
            return `Practice ${item.data.id}: Replace Words`;
          default:
            return 'Practice: Unknown';
        }
      case 'production':
        switch (item.data.tipoDesafio) {
            case 'AUDIO':
                return `Production ${item.data.id}: Audio`;
            case 'TEXTO_LONGO':
                return `Production ${item.data.id}: Long Text`;
            case 'FOTO_E_TEXTO':
                return `Production ${item.data.id}: Photo and Text`;
            case 'UPLOAD_ARQUIVO':
                return `Production ${item.data.id}: File Upload`;
            case 'COMPLETAR_IMAGEM':
                return `Production ${item.data.id}: Complete Image`;
            default:
                return 'Production: Unknown';
        }
      default:
        return 'Item desconhecido';
    }
  }

  const getItemIcon = (type: (typeof allItems)[number]['type']) => {
    switch(type) {
      case 'presentation':
        return <PlayCircleOutlineIcon />;
      case 'practice':
        return <EditIcon />;
      case 'production':
        return <EmojiObjectsIcon />;
      default:
        return null;
    }
  }

  return (
    <Box sx={{ 
        width: '320px', 
        backgroundColor: '#1a1a1a', 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderRight: '1px solid #282828'
    }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: '#e0e0e0', textTransform: 'none', alignSelf: 'flex-start' }}>
        Voltar
      </Button>
      <Typography variant="h6" sx={{ color: '#e0e0e0' }}>
        {loading ? 'Carregando...' : modulo?.titulo}
      </Typography>
      
      {loading ? (
        <CircularProgress color="primary" sx={{alignSelf: 'center', mt: 4}} />
      ) : (
        <List sx={{overflowY: 'auto'}}>
          {allItems.map((item, index) => {
            const isActive = activeItem?.type === item.type && activeItem?.data.id === item.data.id;
            
            const isCompleted = completedItems.some(
                (completedItem) => 
                    completedItem.itemId === item.data.id && 
                    completedItem.itemType === item.type.toUpperCase() as ItemType
            );

            const color = isActive ? '#007aff' : (isCompleted ? '#4CAF50' : '#b3b3b3'); // Green for completed, blue for active, grey for others

            return (
              <ListItem 
                key={`${item.type}-${item.data.id}-${index}`} 
                sx={{ 
                    pl: 0, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#282828' }, 
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(0, 122, 255, 0.1)' : 'transparent', // Light blue background for active item
                }} 
                onClick={() => handleSelectItem(item)}
              >
                <ListItemIcon sx={{color}}>
                  {getItemIcon(item.type)}
                </ListItemIcon>
                <ListItemText 
                  primaryTypographyProps={{ sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: 'italic' } }}
                  primary={getItemText(item)} 
                  sx={{color}}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
