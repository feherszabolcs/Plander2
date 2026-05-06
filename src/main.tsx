import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter, redirect, RouterProvider } from "react-router"
import MainLayout from "./components/layout/MainLayout.tsx"
import HomeView from "./components/views/HomeView.tsx"
import LoginView from "./components/views/LoginView.tsx"
import AccountLayout from "./components/layout/AccountLayout.tsx"
import { AuthProvider } from "./context/AuthContext.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import RegisterView from "./components/views/RegisterView.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    loader: protectedLoader,
    children: [
      {
        index: true,
        element: <HomeView />,
      }
    ]
  },
  {
    path: "/auth",
    element: <AccountLayout />,
    children: [
      {
        path: "login",
        element: <LoginView />,
      },
      {
        path: "register",
        element: <RegisterView />
      }
    ]
  }
])

function protectedLoader() {
  const token = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")!).token : null
  if (!token)
    return redirect("/auth/login")

  return null
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" closeButton={true} />

      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
