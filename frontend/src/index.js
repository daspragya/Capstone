import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light blue for primary elements
    },
    secondary: {
      main: "#f48fb1", // Pink for secondary elements
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Slightly lighter background for paper components
    },
    text: {
      primary: "#e0e0e0", // Light gray text color for better contrast
      secondary: "#b0bec5", // Softer gray for secondary text
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Global font family
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
      color: "#ffffff", // White for h1 headers
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.3,
      color: "#f5f5f5", // Slightly off-white for h2 headers
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      lineHeight: 1.4,
      color: "#e0e0e0", // Light gray for h3 headers
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
      color: "#e0e0e0", // Consistent light gray for h4 headers
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#e0e0e0",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.6,
      color: "#e0e0e0",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.75,
      color: "#b0bec5", // Softer gray for subtitles
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.57,
      color: "#b0bec5",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#e0e0e0", // Standard body text in light gray
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
      color: "#b0bec5", // Secondary body text in softer gray
    },
    button: {
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: 500,
      color: "#90caf9", // Primary color for button text
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
      color: "#b0bec5", // Caption text color in softer gray
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 2.66,
      color: "#b0bec5", // Overline text color in softer gray
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
);
