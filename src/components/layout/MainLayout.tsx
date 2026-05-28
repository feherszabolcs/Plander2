import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import {
    LayoutDashboard, Users,
    Settings, Bell, HelpCircle,
    ChevronLeft, ChevronRight, Layers, Search,
    Moon, Sun, Menu,
    MessageSquareMore,
    Calendar1,
    ClipboardEdit,
} from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import { useAuth } from "@/context/AuthContext";

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    { label: "Kezdőlap", to: "/", icon: LayoutDashboard },
    { label: "Tagok", to: "/users", icon: Users },
    { label: "Üzenetek", to: "/messages", icon: MessageSquareMore, badge: "12" },
    { label: "Beosztások", to: "/duties", icon: Calendar1 },
    { label: "Szolgálati napló", to: "/content", icon: ClipboardEdit },
    { label: "Értesítések", to: "/notifications", icon: Bell, badge: "3" },
];

const BOTTOM_ITEMS = [
    { label: "Beállítások", to: "/settings", icon: Settings },
    { label: "Támogatás", to: "/help", icon: HelpCircle },
];

// ─── Single NavItem ───────────────────────────────────────────────────────────

function NavItem({ item, collapsed }: { item: any; collapsed: boolean }) {
    const location = useLocation();
    const isActive =
        item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to);

    const linkContent = (
        <NavLink
            to={item.to}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                isActive && "bg-accent text-foreground",
                collapsed && "justify-center px-2"
            )}
        >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
                <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                        </Badge>
                    )}
                </>
            )}
        </NavLink>
    );

    if (collapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="relative">
                        {linkContent}
                        {item.badge && (
                            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary" />
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{item.label}</p>
                    {item.badge && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                            {item.badge}
                        </Badge>
                    )}
                </TooltipContent>
            </Tooltip>
        );
    }

    return linkContent;
}

function SidebarContent({ collapsed, onToggle, isMobile = false }: { collapsed: boolean; onToggle: () => void; isMobile: boolean }) {
    const { user } = useAuth();
    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div
                className={cn(
                    "flex h-16 items-center border-b px-4",
                    collapsed && !isMobile && "justify-center px-2"
                )}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <Layers className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {(!collapsed || isMobile) && (
                        <span className="font-semibold truncate">Plander</span>
                    )}
                </div>
            </div>

            <TooltipProvider delayDuration={0}>
                <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
                    {NAV_ITEMS.map((item) => (
                        <NavItem
                            key={item.to}
                            item={item}
                            collapsed={collapsed && !isMobile}
                        />
                    ))}
                </nav>
            </TooltipProvider>

            <Separator />

            {/* Bottom nav */}
            <TooltipProvider delayDuration={0}>
                <nav className="px-2 py-3 space-y-0.5">
                    {BOTTOM_ITEMS.map((item) => (
                        <NavItem
                            key={item.to}
                            item={item}
                            collapsed={collapsed && !isMobile}
                        />
                    ))}
                </nav>
            </TooltipProvider>

            <Separator />

            {/* User row + collapse toggle */}
            <div
                className={cn(
                    "flex items-center gap-3 p-3",
                    collapsed && !isMobile && "justify-center"
                )}
            >
                {(!collapsed || isMobile) && (
                    <>
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src="" alt="" />
                            <AvatarFallback className="text-xs">{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{user?.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    </>
                )}

                {/* Collapse toggle — desktop only */}
                {!isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="h-8 w-8 shrink-0"
                        aria-label={collapsed ? "Kibővítés" : "Összecsukás"}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ onDarkModeToggle }: { onDarkModeToggle: () => void }) {
    const location = useLocation();

    const allItems = [...NAV_ITEMS, ...BOTTOM_ITEMS];
    const current = allItems.find((item) =>
        item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to)
    );
    const pageTitle = current?.label ?? "Oldal";

    const { theme } = useTheme();
    const { logout, user } = useAuth();


    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
            {/* Mobile sidebar trigger via Sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menü megnyitása</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SidebarContent onToggle={() => { }} collapsed={false} isMobile />
                </SheetContent>
            </Sheet>

            {/* Page title */}
            <h1 className="flex-1 text-base font-semibold">{pageTitle}</h1>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <Button
                    variant="outline"
                    className="hidden sm:flex h-9 w-48 justify-start gap-2 text-muted-foreground text-sm font-normal"
                >
                    <Search className="h-3.5 w-3.5" />
                    <span>Keresés…</span>
                    <kbd className="ml-auto text-[10px] font-medium pointer-events-none">
                        ⌘K
                    </kbd>
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={onDarkModeToggle}
                    aria-label="Téma váltás"
                >
                    {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>

                {/* Notifications */}
                <Button variant="outline" size="icon" className="relative" aria-label="Értesítések">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="" alt={user?.name} />
                                <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profil</DropdownMenuItem>
                        <DropdownMenuItem>Beállítások</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={logout}>
                            Kijelentkezés
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}


export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    // const [darkMode, setDarkMode] = useState(false);

    const { setTheme, theme } = useTheme();

    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <aside
                className={cn(
                    "hidden lg:flex flex-col border-r bg-background",
                    "transition-all duration-300 ease-in-out",
                    collapsed ? "w-17" : "w-64"
                )}
            >
                <SidebarContent
                    isMobile={false}
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((v) => !v)}
                />
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar onDarkModeToggle={toggleDarkMode} />

                <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}