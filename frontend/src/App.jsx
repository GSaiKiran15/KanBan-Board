import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Boards from "./pages/Boards";
import Projects from "./pages/Projects";
import axios from 'axios'
import CreateAccountPage from "./pages/createAccountPage";
import LoginPage from "./pages/LoginPage";
import RequireAuth from "./pages/RequireAuth";

const boardsLoader = async ({params}) => {
  const {data} = await axios.get(`api/boards/${params.id}`)
  return data
}

const projectsLoader = async () => {
  const {data} = await axios.get('/api/projects')
  return data
}

const router = createBrowserRouter([
  {
    element: <RequireAuth />,     
    children: [
      { path: "/", element: <Projects />, loader: projectsLoader },
      { path: "/boards/:id", element: <Boards />, loader: boardsLoader },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/create-account", element: <CreateAccountPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}