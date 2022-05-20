import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    text: {
      primary: "#ffffff",
      secondary: "#131313",
    },
    primary: {
      main: "#EE8323",
    },
    secondary: {
      main: "#131313",
    },
  },
  typography: {
    fontFamily: "Changa",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#131313",
          transition: "background-color .25s",
          "&:hover": {
            backgroundColor: "#EE8323",
          },
          "&.Mui-selected": {
            backgroundColor: "#EE8323 !important",
            "&:hover": {
              backgroundColor: "#EE8323",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#EE8323",
          borderRadius: "30px",
          padding: "10px 30px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "10px 0",
          justifyContent: "space-between",
        },
      },
    },
  },
});

export default function CustomTheme({ children }: PropsWithChildren<{}>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
