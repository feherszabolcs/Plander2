import type { IUser } from "@/interfaces/IUser"
import api from "@/lib/api"
import { createContext, use, useEffect, useState } from "react"
import { useNavigate } from "react-router"

interface AuthContextType {
    token: string | null
    user: IUser | null
    isLoading: boolean
    login: (userdata: IUser) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<IUser | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        setToken(storedToken)
        setIsLoading(false)

        api.get("/account/me")
            .then(res => {
                setUser(res.data)
            })
            .catch(() => {
                setToken(null)
                localStorage.removeItem("token")
            })
    }, [])

    const login = (userData: IUser) => {
        localStorage.setItem("token", userData.token)
        setToken(userData.token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        navigate("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = use(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}