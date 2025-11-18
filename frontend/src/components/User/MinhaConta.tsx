
import { Box, Typography, Avatar, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const imgImageWithFallback = "https://www.figma.com/api/mcp/asset/1937fb87-a63c-46ba-896a-85db2aa57d7f";

export default function MinhaConta() {
  return (
    <Box sx={{ width: '636px' }}>
      <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
        Minha Conta
      </Typography>
      <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              alt="User Avatar"
              src={imgImageWithFallback}
              sx={{ width: 100, height: 100 }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#007aff',
                '&:hover': { backgroundColor: '#0056b3' },
              }}
            >
              <EditIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome Completo"
            defaultValue="Léo Silva"
            variant="filled"
            InputLabelProps={{
                style: { color: '#e0e0e0' },
            }}
            sx={{
                '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    borderRadius: '14px',
                    color: 'white',
                    '&:before, &:after': {
                        borderBottom: 'none'
                    }
                }
            }}
          />
          <TextField
            label="E-mail"
            defaultValue="leo@ifpe.edu.br"
            variant="filled"
            disabled
            InputLabelProps={{
                style: { color: '#e0e0e0' },
            }}
            sx={{
                '& .MuiFilledInput-root': {
                    backgroundColor: '#282828',
                    borderRadius: '14px',
                    color: '#b3b3b3',
                    opacity: 0.6,
                    '&:before, &:after': {
                        borderBottom: 'none'
                    }
                }
            }}
            helperText="O e-mail não pode ser alterado por questões de segurança"
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#007aff',
              '&:hover': { backgroundColor: '#0056b3' },
              borderRadius: '14px',
              alignSelf: 'flex-end',
              mt: 2
            }}
          >
            Salvar Alterações
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
