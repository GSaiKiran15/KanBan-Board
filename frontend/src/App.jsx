import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Boards from "./pages/Boards";
import Projects from "./pages/Projects";
import axios from "axios";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";


const routes = [
  {
    path: "/boards/:id",
    element: (
      <Layout>
        <Boards />
      </Layout>
    ),
    loader: async ({ params }) => {
      const id = params.id;
      const response = await axios.get(`/api/boards/${id}`);
      return response.data;
    },
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <Layout>
        <Projects />
      </Layout>
    ),
    loader: async () => {
      const response = await axios.get("/api/projects");
      return response.data;
    },
  },
  {
    path: "/createAccount",
    element: <CreateAccount />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
