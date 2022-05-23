import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";

import LogoImage from "../assets/images/logo.jpg";

interface LogoProps {
  inHeader: boolean;
  textStyle: any;
  logoWidth: string;
}

const Logo = (props: LogoProps) => {
  const { inHeader, textStyle, logoWidth } = props;

  return (
    <Box
      component={inHeader ? NavLink : "div"}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "text.primary",
        textDecoration: "none",
      }}
      to="/"
    >
      <img
        width={logoWidth}
        src={LogoImage}
        alt="logo"
        style={{ borderRadius: "50%" }}
      />
      <Box sx={{ color: "text.primary", fontWeight: "bold", ...textStyle }}>
        CronosCaves
      </Box>
    </Box>
  );
};

export default Logo;
