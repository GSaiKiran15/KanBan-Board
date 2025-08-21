import React from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Boards from "./pages/Boards";
import Projects from "./pages/Projects";
import axios from 'axios'

const routes = [
  {
    path: '/boards/:id',
    element: <Boards/>,
    loader: async ({params}) => {
      const id = params.id
      const response = await axios.get(`/api/boards/${id}`)
      return response.data
    }
  },
  {
    path: '/',
    element: <Projects/>,
    loader: async () => {
      const response = await axios.get('/api/projects')
      return response.data
    }
  }
]

const router = createBrowserRouter(routes)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App