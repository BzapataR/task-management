// components/Providers.tsx
"use client";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import darkTheme from "../theme";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {children}
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default Providers;
