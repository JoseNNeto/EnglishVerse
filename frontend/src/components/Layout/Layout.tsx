
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { Container, Box } from '@mui/material';

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: (theme) => theme.palette.background.default }}>
            <Header />
            <Container maxWidth={false} disableGutters sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Container>
        </Box>
    );
}
