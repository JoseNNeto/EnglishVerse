import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import MinhaConta from '../components/User/MinhaConta';
import MyJourney from '../components/Gamification/MyJourney';

export default function User() {
  const [tab, setTab] = useState(0);
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
