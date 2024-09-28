import { createBrowserRouter } from "react-router-dom";
import Login from "./src/Router/Login";
import CreateAccount from "./src/Router/Create-account";
import ProtectedRouter from "./src/Router/ProtectedRouter";
import Profile from "./src/Components/Profile";
import LayOut from "./src/Router/LayOut";
import Home from "./src/Components/Home"

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayOut />,
    children: [
      {
        path: '',
        element: <ProtectedRouter><Home /></ProtectedRouter>
      }, {
        path: '/profile',
        element: <ProtectedRouter><Profile /></ProtectedRouter>
      }]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/create-account',
    element: <CreateAccount />
  }
]);

export default router;