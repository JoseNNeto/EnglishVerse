import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import User from '../pages/User';
import Presentation from '../pages/Presentation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/user',
    element: <User />,
  },
  {
    path: '/presentation',
    element: <Presentation />,
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
