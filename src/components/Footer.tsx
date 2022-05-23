import { Link } from "react-router-dom";
import { Box, Container } from "@mui/material";

import Logo from "./Logo";

import DecorImage from "../assets/images/footer/decor.png";
import TwitterLogo from "../assets/images/footer/twitter.png";
import TelegramLogo from "../assets/images/footer/telegram.png";
import DiscordLogo from "../assets/images/footer/discord.png";
import WhatsappLogo from "../assets/images/footer/whatsapp.png";
import FacebookLogo from "../assets/images/footer/facebook.png";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        color: "#111111",
      }}
    >
      <img
        style={{ width: "100%", marginBottom: "-50px" }}
        src={DecorImage}
        alt="decor"
      />
      <Box
        sx={{
          backgroundColor: "primary.main",
          padding: "40px 0",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Logo
              inHeader={false}
              logoWidth="80px"
              textStyle={{ color: "#111111", fontSize: "32px" }}
            />
            <Box
              sx={{
                fontSize: "24px",
                margin: "45px 0",
              }}
            >
              An international abstract presentation, built for the community.
            </Box>
            <Box
              sx={{ fontFamily: "Archivo", fontSize: "16px", color: "#3F2003" }}
            >
              Copyright &copy; 2022. CroCoDudes. All rights reserved
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                fontSize: "64px",
                fontWeight: 600,
                marginBottom: "35px",
                textAlign: "right",
              }}
            >
              Stay Connected
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "55px",
              }}
            >
              <a href="#" target="_blank">
                <img src={TwitterLogo} alt="twitter" />
              </a>
              <a href="#" target="_blank">
                <img src={TelegramLogo} alt="telegram" />
              </a>
              <a href="#" target="_blank">
                <img src={DiscordLogo} alt="discord" />
              </a>
              <a href="#" target="_blank">
                <img src={WhatsappLogo} alt="whatsapp" />
              </a>
              <a href="#" target="_blank">
                <img src={FacebookLogo} alt="facebook" />
              </a>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                fontSize: "16px",
                fontFamily: "Archivo",

                a: {
                  color: "#111111",
                },
              }}
            >
              <Link to="/terms" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </Link>
              <Link to="/policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
