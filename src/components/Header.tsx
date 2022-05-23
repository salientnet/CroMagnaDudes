import { NavLink } from "react-router-dom";
import { Container, Box } from "@mui/material";

import Logo from "./Logo";
import Connect from "./Connect";

const Header = () => {
  const classes = {
    navLink: {
      color: "text.primary",
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
      <Logo
        inHeader={true}
        logoWidth="55px"
        textStyle={{ fontSize: "16px" }}
      />

      <Box>
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
