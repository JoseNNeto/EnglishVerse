
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowBack, CheckCircle, EmojiObjects } from '@mui/icons-material';

export default function ProductionSidebar() {
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: (theme) => theme.palette.mode === 'light' ? '#404E7C' : '#1b2a4a',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        minHeight: '100vh'
      }}
    >
      <Button startIcon={<ArrowBack />} sx={{ color: '#e0e0e0', textTransform: 'none', justifyContent: 'flex-start' }}>
        Voltar ao Dashboard
      </Button>
      <Typography variant="h6" sx={{ color: '#e0e0e0' }}>
        Simple Present com Cenas de The Office
      </Typography>
      <List>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: (theme) => theme.palette.mode === 'light' ? '#ffffff' : '#007aff'}}>
            <CheckCircle />
          </ListItemIcon>
          <ListItemText primary="Presentation" sx={{color: (theme) => theme.palette.mode === 'light' ? '#ffffff' : '#007aff'}}/>
        </ListItem>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: (theme) => theme.palette.mode === 'light' ? '#ffffff' : '#007aff'}}>
            <CheckCircle />
          </ListItemIcon>
          <ListItemText primary="Practice" sx={{color: (theme) => theme.palette.mode === 'light' ? '#ffffff' : '#007aff'}}/>
        </ListItem>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: (theme) => theme.palette.mode === 'light' ? '#ffffff' : '#007aff'}}>
            <EmojiObjects />
          </ListItemIcon>
          <ListItemText primary="Production" sx={{color: (theme) => theme.palette.mode === 'light' ? '#ffffff' : '#007aff'}}/>
        </ListItem>
      </List>
    </Box>
  );
}
