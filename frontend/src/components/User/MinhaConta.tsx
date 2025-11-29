
import { Box, Typography, Avatar, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function MinhaConta() {
  const { user, login } = useAuth();

  const [nome, setNome] = useState('');
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setNome(user.nome);
    }
  }, [user]);

  const handleNomeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.put('/usuarios/me/nome', { nome });
      const { token } = response.data;
      login(token); // Atualiza o contexto e o localStorage com o novo token
      setSnackbar({ open: true, message: 'Nome alterado com sucesso!', severity: 'success' });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Não foi possível alterar o nome.', severity: 'error' });
    }
  };

  const handleSenhaSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (senhaNova !== confirmarSenha) {
      setSnackbar({ open: true, message: 'A nova senha e a confirmação não coincidem.', severity: 'error' });
      return;
    }
    try {
      const response = await api.put('/usuarios/me/senha', { senhaAntiga, senhaNova });
      const { token } = response.data;
      login(token); // Atualiza a sessão com um novo token por segurança
      setSnackbar({ open: true, message: 'Senha alterada com sucesso!', severity: 'success' });
      // Limpa os campos de senha
      setSenhaAntiga('');
      setSenhaNova('');
      setConfirmarSenha('');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data || 'Não foi possível alterar a senha. Verifique a senha antiga.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };


  if (!user) {
    return null; // Ou um loader
  }

  return (
    <>
      <Box sx={{ width: '636px' }}>
        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
          Minha Conta
        </Typography>
        <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar sx={{ width: 100, height: 100, fontSize: '3rem', bgcolor: '#007aff' }}>
              {user.nome.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Box component="form" onSubmit={handleNomeSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              variant="filled"
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#282828', borderRadius: '14px', color: 'white', '&:before, &:after': { borderBottom: 'none' } } }}
            />
            <TextField
              label="E-mail"
              value={user.sub}
              variant="filled"
              disabled
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#282828', borderRadius: '14px', color: '#b3b3b3', opacity: 0.6, '&:before, &:after': { borderBottom: 'none' } } }}
              helperText="O e-mail não pode ser alterado por questões de segurança"
            />
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#007aff', '&:hover': { backgroundColor: '#0056b3' }, borderRadius: '14px', alignSelf: 'flex-end', mt: 2 }}>
              Salvar Alterações
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ color: '#e0e0e0', mb: 2 }}>
          Alterar Senha
        </Typography>
        <Box sx={{ backgroundColor: '#1a1a1a', borderRadius: '14px', p: 3 }}>
          <Box component="form" onSubmit={handleSenhaSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Senha Atual"
              type="password"
              value={senhaAntiga}
              onChange={(e) => setSenhaAntiga(e.target.value)}
              variant="filled"
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#282828', borderRadius: '14px', color: 'white', '&:before, &:after': { borderBottom: 'none' } } }}
            />
            <TextField
              label="Nova Senha"
              type="password"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              variant="filled"
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#282828', borderRadius: '14px', color: 'white', '&:before, &:after': { borderBottom: 'none' } } }}
            />
            <TextField
              label="Confirmar Nova Senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              variant="filled"
              InputLabelProps={{ style: { color: '#e0e0e0' } }}
              sx={{ '& .MuiFilledInput-root': { backgroundColor: '#282828', borderRadius: '14px', color: 'white', '&:before, &:after': { borderBottom: 'none' } } }}
            />
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#007aff', '&:hover': { backgroundColor: '#0056b3' }, borderRadius: '14px', alignSelf: 'flex-end', mt: 2 }}>
              Alterar Senha
            </Button>
          </Box>
        </Box>
      </Box>
      {snackbar && (
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar(null)} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
