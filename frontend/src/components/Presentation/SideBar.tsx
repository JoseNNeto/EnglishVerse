
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

export default function SideBar() {
  return (
    <Box sx={{ 
        width: '280px', 
        backgroundColor: '#1a1a1a', 
        p: 3, 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 4
    }}>
      <Button startIcon={<ArrowBackIcon />} sx={{ color: '#e0e0e0', textTransform: 'none' }}>
        Voltar ao Dashboard
      </Button>
      <Typography variant="h6" sx={{ color: '#e0e0e0' }}>
        Simple Present com Cenas de The Office
      </Typography>
      <List>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: '#007aff'}}>
            <PlayCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Presentation" sx={{color: '#007aff'}}/>
        </ListItem>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: '#b3b3b3'}}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Practice" sx={{color: '#b3b3b3'}}/>
        </ListItem>
        <ListItem sx={{ pl: 0 }}>
          <ListItemIcon sx={{color: '#b3b3b3'}}>
            <EmojiObjectsIcon />
          </ListItemIcon>
          <ListItemText primary="Production" sx={{color: '#b3b3b3'}}/>
        </ListItem>
      </List>
    </Box>
  );
}
