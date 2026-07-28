import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import MinhaConta from '../components/User/MinhaConta';
import MyJourney from '../components/Gamification/MyJourney';
import { useAuth } from '../contexts/AuthContext';

export default function User() {
  const [tab, setTab] = useState(0);
  const { user } = useAuth();

  if (user?.perfil === 'DOCENTE') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 5, mt: 4, minHeight: '100vh' }}>
        <MinhaConta />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, pb: 5, mt: 2, minHeight: '100vh' }}>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Seções do perfil">
        <Tab label="Minha Jornada" />
        <Tab label="Conta e segurança" />
      </Tabs>
      {tab === 0 ? <MyJourney /> : <MinhaConta />}
    </Box>
  );
}
