import { NavLink } from "react-router-dom";
import { Container, Box } from "@mui/material";

import Connect from "./Connect";

import LogoImage from "../assets/images/logo.jpg";

const Header = () => {
  const classes = {
    logo: {
      display: "flex",
      marginRight: "15px",
    },
    navLink: {
      color: "common.white",
      fontSize: "1rem",
      textDecoration: "none",
      textTransform: "uppercase",
      margin: "0 15px",
      transition: "color .25s",

      "&.active": {
        color: "primary.main",
        fontWeight: "bold",
      },

      "&:hover": {
        color: "primary.main",
      },
    },
  };

  return (
    <Container
      sx={{
        py: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontFamily: "sOuTh Afirkas 2100",
        }}
      >
        <Box component={NavLink} sx={classes.logo} to="/">
          <img
            width="50"
            src={LogoImage}
            alt="logo"
            style={{ borderRadius: "50%" }}
          />
        </Box>
        <Box component={NavLink} sx={classes.navLink} to="/">
          Home
        </Box>
        <Box component={NavLink} sx={classes.navLink} to="/dashboard">
          Dashboard
        </Box>
        <Box component={NavLink} sx={classes.navLink} to="/about-us">
          About us
        </Box>
      </Box>
      <Connect />
    </Container>
  );
};

export default Header;
