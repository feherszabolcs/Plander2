import { AuthProvider } from "@/context/AuthContext";
import { Outlet } from "react-router";

export default function ProvidersLayout() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}