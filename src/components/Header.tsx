// components/Header.tsx
"use client";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import { Menu as MenuIcon, Search, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
    onAddClick: () => void;
}

const Header = ({ title, onMenuClick, onAddClick }: HeaderProps) => {
    const theme = useTheme();

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
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                >
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            ml: 2,
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: 1,
                            p: "4px 12px",
                            width: { xs: "100%", sm: 300 },
                        }}
                    >
                        <Search
                            fontSize="small"
                            sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <input
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-400"
                            placeholder="Search events..."
                        />
                    </Box>
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
