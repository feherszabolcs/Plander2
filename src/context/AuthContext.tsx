import { createContext, use, useEffect, useState } from "react"

interface AuthContextType {
    token: string | null
    user: UserData
    isLoading: boolean
    login: (userdata: UserData) => void
    logout: () => void
}

interface UserData {
    userName: string,
    email: string,
    token: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem("userData") || "null")?.token
        setToken(storedToken)
        setIsLoading(false)
    }, [])

    const login = (userData: UserData) => {
        localStorage.setItem("userData", JSON.stringify(userData))
        setToken(userData.token)
    }

    const logout = () => {
        localStorage.removeItem("userData")
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout, user: JSON.parse(localStorage.getItem("userData") || "null") }}>
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