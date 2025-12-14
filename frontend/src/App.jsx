import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Boards from "./pages/Boards";
import Projects from "./pages/Projects";
import axios from "axios";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import { waitForAuth } from "./utils/waitForAuth.js";

const routes = [
  {
    path: "/boards/:id",
    element: (
      <Layout>
        <Boards />
      </Layout>
    ),
    loader: async ({ params }) => {
      const user = await waitForAuth();
      const id = params.id;
      if (!user) return redirect("/login");
      try {
        const token = await user.getIdToken();
        const response = await axios.get(`/api/boards/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return redirect("/login");
        }
        return [];
      }
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
      const user = await waitForAuth();
      if (!user) return redirect("/login");
      try {
        const token = await user.getIdToken();
        const response = await axios.get("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return redirect("/login");
        }
        return [];
      }
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
