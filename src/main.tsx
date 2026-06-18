import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter, redirect, RouterProvider } from "react-router"
import MainLayout from "./components/layout/MainLayout.tsx"
import HomeView from "./components/views/HomeView.tsx"
import LoginView from "./components/views/LoginView.tsx"
import AccountLayout from "./components/layout/AccountLayout.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import RegisterView from "./components/views/RegisterView.tsx"
import UsersView from "./components/views/Users/UsersView.tsx"
import ProvidersLayout from "./components/layout/ProvidersLayout.tsx"
import DutiesView from "./components/views/Duties/DutiesView.tsx"
import ChatHome from "./components/views/Chats/ChatHome.tsx"
import ChatRoom from "./components/views/Chats/ChatRoom.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProvidersLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        loader: protectedLoader,
        children: [
          {
            index: true,
            element: <HomeView />,
          },
          {
            path: "users/",
            element: <UsersView />
          },
          {
            path: "messages",
            element: <ChatRoom />
          },
          {
            path: "duties",
            element: <DutiesView />
          }
        ]
      },
      {
        path: "/auth",
        element: <AccountLayout />,
        loader: redirectLoader,
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
    ]
  }
])

function protectedLoader() {
  const token = localStorage.getItem("token")
  if (!token)
    return redirect("/auth/login")

  return null
}
function redirectLoader() {
  const token = localStorage.getItem("token")
  if (token)
    return redirect("/")

  return null
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" closeButton={true} />

    </ThemeProvider>
  </StrictMode>
)
