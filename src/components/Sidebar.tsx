// components/Sidebar.tsx
"use client";
import { List, ListItem, Typography, Button } from "@mui/material";
import {
    CalendarToday,
    EventNote,
    DashboardCustomize,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { NavItem } from "../types";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

interface SidebarProps {
    isMobile: boolean;
    setMobileOpen?: (open: boolean) => void;
}

const navItems: NavItem[] = [
    { text: "Dashboard", icon: <DashboardCustomize />, route: "/" },
    { text: "Calendar", icon: <CalendarToday />, route: "/calendar" },
    // { text: "Events", icon: <EventNote />, route: "/events" },
    // { text: "Profile", icon: <Person />, route: "/profile" },
    // { text: "Settings", icon: <Settings />, route: "/settings" },
];

const Sidebar = ({ isMobile, setMobileOpen }: SidebarProps) => {
    const router = useRouter();
    const theme = useTheme();

    const handleNavigation = (route: string) => {
        // Close mobile drawer if applicable
        if (isMobile && setMobileOpen) {
            setMobileOpen(false);
        }
        router.push(route);
    };

    return (
        <div className="h-full flex flex-col">
            <Link href="/">
                <div className="flex items-center justify-center p-4 h-16 border-b border-[#333] mb-6">
                    <Typography
                        variant="h6"
                        component="div"
                        className="font-bold flex items-center text-primary"
                    >
                        <EventNote className="mr-2" />
                        Event Manager
                    </Typography>
                </div>
            </Link>

            <List className="flex-grow">
                {navItems.map((item) => (
                    <ListItem
                        key={item.text}
                        disablePadding
                        sx={{
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                        }}
                    >
                        <Button
                            fullWidth
                            sx={{
                                justifyContent: "flex-start",
                                padding: "12px 16px",
                                borderRadius: 0,
                                textTransform: "none",
                                color: "text.primary",
                            }}
                            startIcon={item.icon}
                            onClick={() => handleNavigation(item.route)}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "0.95rem",
                                }}
                            >
                                {item.text}
                            </Typography>
                        </Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Sidebar;
