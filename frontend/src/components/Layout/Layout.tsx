
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { Container, Box } from '@mui/material';

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            <Container maxWidth={false} disableGutters sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Container>
        </Box>
    );
}
