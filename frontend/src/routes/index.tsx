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
      { path: '/presentation/:id', element: <Presentation /> },
      { path: '/practice/marcar/:id', element: <PracticeMarcar /> },
      { path: '/practice/completar/:id', element: <PracticeCompletar /> },
      { path: '/practice/lista/:id', element: <PracticeLista /> },
      { path: '/practice/selecionar/:id', element: <PracticeSelecionar /> },
      { path: '/production/arquivo/:id', element: <ProductionArquivo /> },
      { path: '/production/texto/:id', element: <ProductionTexto /> },
      { path: '/production/ouvir-completar/:id', element: <ProductionOuvirCompletar /> },
      { path: '/production/relacionar/:id', element: <ProductionRelacionar /> },
      { path: '/production/substituir/:id', element: <ProductionSubstituir /> },
      { path: '/production/ouvir-texto/:id', element: <ProductionOuvirTexto /> },
      { path: '/production/postagem/:id', element: <ProductionPostagem /> },
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
