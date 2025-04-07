import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from "@mui/material";
import { CalendarToday, ListAlt, Settings, Menu as MenuIcon } from "@mui/icons-material";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/router";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1a1a1a",
      paper: "#2a2a2a",
    },
    primary: {
      main: "#1e2a78", // Navy blue
    },
    secondary: {
      main: "#ff00cc", // Neon pink
    },
  },
});

const drawerWidth = 240;

const navItems = [
  { text: "Calendar", icon: <CalendarToday />, route: "/" },
  { text: "Activities", icon: <ListAlt />, route: "/activities" },
  { text: "Settings", icon: <Settings />, route: "/settings" },
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
    <div>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} onClick={() => router.push(item.route)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <main style={{ flexGrow: 1, padding: 24, marginLeft: isMobile ? 0 : drawerWidth, marginTop: 64 }}>
        <Typography variant="h4" gutterBottom>
          Select Date
        </Typography>
        <Calendar onChange={setDate} value={date} />
      </main>
    </ThemeProvider>
  );
}
