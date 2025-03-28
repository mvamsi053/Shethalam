import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "./contexts/theme-provider";

import City from "./pages/City";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layout";

function App() {
  const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        { index: true, Component: Dashboard },
        { path: "city/:cityName", Component: City },
      ],
    },
  ]);
  return (
    <ThemeProvider defaultTheme='dark'>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
