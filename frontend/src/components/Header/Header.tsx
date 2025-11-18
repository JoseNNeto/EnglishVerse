import { AppBar, Toolbar, InputBase, Badge, Avatar, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoEnglishVerse from '../../assets/englishverse-sem-fundo.png';

const imgEnglishverseSemFundo51 = "https://www.figma.com/api/mcp/asset/376f4fb4-ad01-49d7-ab60-e98e20cc6e91";

export default function Header() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#1a1a1a', 
        borderBottom: '1px solid #282828',
        padding: '0px 0px'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '69px' }}>
        <Box
          component="img"
          sx={{
            height: '50px',
            width: '125px',
          }}
          alt="English Verse logo"
          src={LogoEnglishVerse}
        />
        <Box sx={{
          position: 'relative',
          backgroundColor: '#282828',
          borderRadius: '24px',
          width: '600px',
          height: '50px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <SearchIcon sx={{ position: 'absolute', left: '16px', color: 'white' }} />
          <InputBase
            placeholder="Buscar por série, música ou tópico..."
            sx={{
              color: 'white',
              width: '100%',
              paddingLeft: '48px'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge 
            badgeContent="" 
            color="primary" 
            variant="dot"
            sx={{
              "& .MuiBadge-badge": { 
                backgroundColor: "#007aff",
                width: '8px',
                height: '8px',
                borderRadius: '50%',
              },
              mr: 2
            }}
          >
            <NotificationsIcon sx={{color: 'white'}}/>
          </Badge>
          <Avatar sx={{ bgcolor: '#007aff' }}>N</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}