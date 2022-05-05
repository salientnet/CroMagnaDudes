import { Link } from "react-router-dom";
import { Container, Box } from "@mui/material";

import Connect from "../Connect";

import "./Header.css";
import LogoImage from "../../assets/images/logo.jpg";

const Header = () => {
  return (
    <Container
      className="header"
      sx={{
        py: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link className="navLink" to="/">
          <img width="40" src={LogoImage} alt="logo" style={{borderRadius: "50%"}} />
        </Link>
        <Link className="navLink" to="/dashboard">
          Dashboard
        </Link>
      </Box>
      <Connect />
    </Container>
  );
};

export default Header;
