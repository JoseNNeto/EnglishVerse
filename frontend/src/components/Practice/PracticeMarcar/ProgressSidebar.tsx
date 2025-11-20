
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowBack, CheckCircle, Edit, EmojiObjects } from '@mui/icons-material';

export default function ProgressSidebar() {
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: '#1a1a1a',
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
          <ListItemIcon sx={{color: '#007aff'}}>
            <CheckCircle />
          </ListItemIcon>
          <ListItemText primary="Presentation" sx={{color: '#007aff'}}/>
        </ListItem>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: '#007aff'}}>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Practice" sx={{color: '#007aff'}}/>
        </ListItem>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: '#b3b3b3'}}>
            <EmojiObjects />
          </ListItemIcon>
          <ListItemText primary="Production" sx={{color: '#b3b3b3'}}/>
        </ListItem>
      </List>
    </Box>
  );
}
