import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import User from '../pages/User';
import Presentation from '../pages/Presentation';
import PracticeMarcar from '../pages/Practice/PracticeMarcar';
import PracticeCompletar from '../pages/Practice/Completar';
import PracticeLista from '../pages/Practice/Lista';
import PracticeSelecionar from '../pages/Practice/Selecionar';
import ProductionArquivo from '../pages/Production/Arquivo';
import ProductionTexto from '../pages/Production/Texto';
import ProductionOuvirCompletar from '../pages/Production/OuvirCompletar';
import ProductionRelacionar from '../pages/Production/Relacionar';
import ProductionSubstituir from '../pages/Production/Substituir';
import ProductionOuvirTexto from '../pages/Production/OuvirTexto';
import ProductionPostagem from '../pages/Production/Postagem';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute

const router = createBrowserRouter([
  {
    element: <ProtectedRoute><Layout /></ProtectedRoute>, // Wrap Layout with ProtectedRoute
    children: [
      { path: '/', element: <Home /> },
      { path: '/user', element: <User /> },
      { path: '/presentation', element: <Presentation /> },
      { path: '/practice/marcar', element: <PracticeMarcar /> },
      { path: '/practice/completar', element: <PracticeCompletar /> },
      { path: '/practice/lista', element: <PracticeLista /> },
      { path: '/practice/selecionar', element: <PracticeSelecionar /> },
      { path: '/production/arquivo', element: <ProductionArquivo /> },
      { path: '/production/texto', element: <ProductionTexto /> },
      { path: '/production/ouvir-completar', element: <ProductionOuvirCompletar /> },
      { path: '/production/relacionar', element: <ProductionRelacionar /> },
      { path: '/production/substituir', element: <ProductionSubstituir /> },
      { path: '/production/ouvir-texto', element: <ProductionOuvirTexto /> },
      { path: '/production/postagem', element: <ProductionPostagem /> },
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  }
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
