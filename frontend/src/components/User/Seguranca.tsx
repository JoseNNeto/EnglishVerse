
import { Box, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

export default function Seguranca() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowCurrentPassword = () => setShowCurrentPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

  return (
    <Box sx={{ width: '636px' }}>
      <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
        Segurança e Privacidade
      </Typography>
      <Box sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? '#456379' : '#1b2a4a', borderRadius: '14px', p: 3 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Senha Atual"
            type={showCurrentPassword ? 'text' : 'password'}
            variant="filled"
            InputLabelProps={{
                style: { color: '#b3b3b3' },
            }}
            sx={{
                '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    borderRadius: '14px',
                    color: '#b3b3b3',
                    '&:before, &:after': {
                        borderBottom: 'none'
                    }
                }
            }}
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{color: '#b3b3b3'}}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
          <TextField
            label="Nova Senha"
            type={showNewPassword ? 'text' : 'password'}
            variant="filled"
            InputLabelProps={{
                style: { color: '#b3b3b3' },
            }}
            sx={{
                '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    borderRadius: '14px',
                    color: '#b3b3b3',
                    '&:before, &:after': {
                        borderBottom: 'none'
                    }
                }
            }}
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{color: '#b3b3b3'}}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
          <TextField
            label="Confirmar Nova Senha"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="filled"
            InputLabelProps={{
                style: { color: '#b3b3b3' },
            }}
            sx={{
                '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    borderRadius: '14px',
                    color: '#b3b3b3',
                    '&:before, &:after': {
                        borderBottom: 'none'
                    }
                }
            }}
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{color: '#b3b3b3'}}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: (theme) => theme.palette.mode === 'light' ? '#75c3ff' : '#007aff',
              color: '#e0e0e0',
              '&:hover': { backgroundColor: (theme) => theme.palette.mode === 'light' ? '#75c3ff' : '#007aff' },
              borderRadius: '14px',
              alignSelf: 'flex-end',
              mt: 2
            }}
          >
            Alterar Senha
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
