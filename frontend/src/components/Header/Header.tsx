import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, InputBase, Avatar, Box,
  Menu, MenuItem, Dialog, DialogActions, DialogContent,
  DialogContentText, Button, DialogTitle
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoEnglishVerse from '../../assets/englishverse-sem-fundo.png';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setSearchParams({ q: searchQuery.trim() });
      } else {
        searchParams.delete('q');
        setSearchParams(searchParams);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, setSearchParams]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGoToUser = () => {
    navigate('/user');
    handleMenuClose();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    logout();
    handleCloseDialog();
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#1b2a4a',
          backgroundImage: 'none',
          borderBottom: `1px solid ${colors.navAccent}`,
          padding: '0px 0px'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: '69px' }}>
          <Box
            component="img"
            sx={{ height: '50px', width: '125px', cursor: 'pointer' }}
            alt="English Verse logo"
            src={LogoEnglishVerse}
            onClick={() => navigate('/')}
          />

          {isHomePage && (
            <Box
              sx={{
                position: 'relative',
                backgroundColor: colors.navAccent,
                borderRadius: '24px',
                width: '600px',
                height: '50px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <SearchIcon sx={{ position: 'absolute', left: '16px', color: '#b3b3b3' }} />
              <InputBase
                placeholder="Buscar por série, música ou tópico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: '#e0e0e0',
                  width: '100%',
                  paddingLeft: '48px',
                  '& input::placeholder': {
                    color: '#b3b3b3',
                    opacity: 1,
                  },
                }}
              />
            </Box>
          )}

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: isHomePage ? 'auto' : '600px',
            justifyContent: 'flex-end'
          }}>
            <ThemeToggle />

            {isAuthenticated && user && (
              <>
                <Avatar
                  sx={{ bgcolor: colors.primaryStrong ?? colors.primary, cursor: 'pointer', ml: 2 }}
                  onClick={handleMenuOpen}
                >
                  {user.nome.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                >
                  <MenuItem onClick={handleGoToUser}>Minha Conta</MenuItem>
                  <MenuItem onClick={handleOpenDialog}>Sair</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza que deseja sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleLogout} autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
