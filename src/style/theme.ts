import {createTheme} from "@mui/material";
import {responsiveFontSizes} from "@mui/material";

export const darkTheme = responsiveFontSizes(createTheme({
  palette: {
    mode: "dark",
    background: {
      default: ""
    },
    primary: {
      main: "#f143e2",
      dark: "#40187f"
    },
    info: {
      main: "#31C26A"
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          "&:active": {
            background: "linear-gradient(94.07deg, #F143E2 5.19%, #40187F 100%)"
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: "linear-gradient(94.07deg, #F143E2 5.19%, #40187F 100%)",
          height: 4,
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          minHeight: "50px",
          ".Mui-selected": {
            color: "rgb(255, 255, 255) !important",
            fontWeight: "bold"
          }
        },

      }
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          border: "1px solid rgba(255, 255, 255, 0.125)",

          borderRadius: "6px",
          "&:not(:last-of-type)": {
            borderRadius: "6px",
          },
          "&:not(:first-of-type)": {
            borderRadius: "6px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.125)",
            // borderLeft: "1px solid rgba(255, 255, 255, 0.6)"
          },
        },
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            background: "linear-gradient(94.07deg, #F143E2 5.19%, #40187F 100%)",
            border: "0px",
          }
        }
      }
    }
  }
}))
