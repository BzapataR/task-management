"use client";
import { useState } from "react";
import {
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
} from "@mui/material";
import {
    CalendarToday,
    ListAlt,
    Settings,
    Add,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

const navItems = [
    { text: "Calendar", icon: <CalendarToday className="text-white"/>, route: "/" },
    { text: "Activities", icon: <ListAlt className={'text-white'}/>, route: "/activities" },
    { text: "Settings", icon: <Settings className={'text-white'} />, route: "/settings" },
];

export default function Home() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width:600px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div className="bg-zinc-900 text-white h-full">
            <Toolbar />
            <List>
                {navItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => router.push(item.route)}
                    >
                        <ListItemIcon className="text-white">{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} className="text-white" />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <div className="bg-zinc-900 min-h-screen text-white">
            <AppBar
                position="fixed"
                className="bg-zinc-800"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div">
                        ToDo Activities
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#18181b", // Tailwind's zinc-900
                        color: "#ffffff",
                    },
                }}
            >
                {drawer}
            </Drawer>

            <main
                className={`transition-all duration-300 ${
                    isMobile ? '' : 'ml-[240px]'
                } pt-16 bg-zinc-900 text-white min-h-[calc(100vh-64px)] overflow-y-auto`}
            >
                <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 outline -bottom-1 outline-white">
                    <div className="flex items-center justify-center mb-4 gap-35">
                        <h1 className="text-3xl font-semibold">Select Date</h1>
                        <IconButton color="inherit">
                            <Add className="text-white" />
                        </IconButton>
                    </div>

                    <div className="bg-white text-black rounded-lg shadow-lg p-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar />
                    </LocalizationProvider>
                </div>
                </section>

                <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 ">
                    <h1 className="text-3xl font-semibold mb-6">Your Activities</h1>
                    <div className="w-full max-w-2xl bg-white text-black rounded-lg shadow-lg p-6">
                        <p className="text-lg">This is where your activities will go.</p>
                    </div>
                </section>
            </main>


        </div>
    );
}
