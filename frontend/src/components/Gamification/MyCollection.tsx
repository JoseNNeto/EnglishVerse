import { useState } from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import BadgeIcon from '@mui/icons-material/Badge';
import PortraitIcon from '@mui/icons-material/Portrait';
import { useGamification } from '../../contexts/GamificationContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';

export default function MyCollection() {
  const { journey, equipInventoryItem } = useGamification();
  const { mode } = useThemeMode();
  const colors = appPalette[mode];
  const [equippingId, setEquippingId] = useState<number | null>(null);

  if (!journey) return null;
  const shields = journey.inventory.filter(item => item.rewardType === 'ORBITAL_SHIELD');
  const cosmetics = journey.inventory.filter(item =>
    item.rewardType === 'PROFILE_TITLE' || item.rewardType === 'AVATAR_FRAME');
  const availableShields = shields.reduce((total, item) => total + item.quantity, 0);

  const equip = async (itemId: number) => {
    setEquippingId(itemId);
    try {
      await equipInventoryItem(itemId);
    } finally {
      setEquippingId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h5">My Collection</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Recompensas especiais obtidas ao concluir categorias de conquistas.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, height: '100%', borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.surfaceRaised }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <SecurityIcon color={availableShields ? 'info' : 'disabled'} sx={{ fontSize: 38 }} />
              <Chip label={`${availableShields} available`} color={availableShields ? 'info' : 'default'} size="small" />
            </Stack>
            <Typography fontWeight={900} mt={1.5}>Orbital Shield</Typography>
            <Typography variant="body2" color="text.secondary">
              Protege automaticamente seus Days orbiting quando você deixa de estudar por exatamente um dia.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2.5, height: '100%', borderRadius: 3, border: `1px solid ${colors.border}`, bgcolor: colors.surfaceRaised }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <BadgeIcon color="warning" /><Typography fontWeight={900}>Profile cosmetics</Typography>
            </Stack>
            {cosmetics.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Conclua Content Mastery para escolher um título ou uma moldura de avatar.</Typography>
            ) : cosmetics.map(item => (
              <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }} spacing={1.5}
                justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ py: 1 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  {item.rewardType === 'PROFILE_TITLE' ? <BadgeIcon /> : <PortraitIcon />}
                  <Box><Typography fontWeight={800}>{item.name}</Typography><Typography variant="caption" color="text.secondary">{item.description}</Typography></Box>
                </Stack>
                <Button size="small" variant={item.equipped ? 'outlined' : 'contained'} disabled={item.equipped || equippingId !== null}
                  onClick={() => void equip(item.id)}>
                  {item.equipped ? 'Equipped' : equippingId === item.id ? 'Equipping...' : 'Equip'}
                </Button>
              </Stack>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
