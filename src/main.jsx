import { createRoot } from 'react-dom/client'
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from './context/AuthProvider';


const queryClient = new QueryClient();


createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);