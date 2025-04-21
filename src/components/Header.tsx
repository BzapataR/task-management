import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon, Add } from "@mui/icons-material";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  onAddClick: () => void;
}

const Header = ({ title, onMenuClick, onAddClick }: HeaderProps) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: `240px` },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "#1a1a1a",
      }}
    >
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: "none" } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <strong>{title}</strong>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            color="inherit"
            className="add-button"
            onClick={onAddClick}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <Add />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
