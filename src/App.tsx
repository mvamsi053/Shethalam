import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "./contexts/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import City from "./pages/City";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layout";

function App() {
  const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark'>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
