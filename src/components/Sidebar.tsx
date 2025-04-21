import { List, ListItem, Typography, Button } from "@mui/material";
import { CalendarToday, EventNote, DashboardCustomize } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { NavItem } from "@types";
import Link from "next/link";

interface SidebarProps {
  isMobile: boolean;
  setMobileOpen?: (open: boolean) => void;
}

const navItems: NavItem[] = [
  { text: "Dashboard", icon: <DashboardCustomize />, route: "/" },
  { text: "Calendar", icon: <CalendarToday />, route: "/calendar" },
];

const Sidebar = ({ isMobile, setMobileOpen }: SidebarProps) => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(false);
    }
    router.push(route);
  };

  return (
    <div className="flex h-full flex-col">
      <Link href="/">
        <div className="mb-6 flex h-16 items-center justify-center border-b border-[#333] p-4">
          <Typography variant="h6" component="div" className="text-primary flex items-center font-bold">
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
