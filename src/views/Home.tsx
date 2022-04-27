import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Web3 from "web3";

import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import { numberWithCommas } from "../helper/utils";
import {
  totalSupply,
  mint,
  getMintPrice,
  web3Instance,
} from "../helper/contract";

const Home = () => {
  const [mintPrice, setMintPrice] = useState<number>(0);
  const [mintQuantity, setMintQuantity] = useState<any>(1);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [totalCounts, setTotalCounts] = useState(0);
  const { address } = useAuthContext();
  const { showSnackbar } = useSnackbar();

  web3Instance.setProvider(Web3.givenProvider);

  const handleMint = () => {
    if (!address) {
      showSnackbar({
        severity: "error",
        message: "Please connect your wallet",
      });

      return;
    }

    if (parseInt(mintQuantity) > 10) {
      showSnackbar({
        severity: "error",
        message: "It should be less than 10",
      });

      return;
    }

    if (mintQuantity === "") {
      showSnackbar({
        severity: "error",
        message: "It could not be empty",
      });

      return;
    }

    setIsMinting(true);
    const amount = mintPrice * parseInt(mintQuantity) * 1e8;

    mint(address, amount, parseInt(mintQuantity))
      .then((result: any) => {
        setIsMinting(false);
        showSnackbar({
          severity: "success",
          message: "Minted Successfully",
        });
      })
      .catch((err: any) => {
        console.log(err);
        setIsMinting(false);
      });
  };

  const handleQuantity = (e: any) => {
    setMintQuantity(e.target.value);
  };

  useEffect(() => {
    if (address) {
      totalSupply().then((res: any) => {
        setTotalCounts(res);
      });

      getMintPrice().then((price: any) => {
        console.log(price);
        setMintPrice(parseInt(price) / 1e8);
      });
    }
  }, [address]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      color="white"
    >
      <Typography fontSize="3rem" mt="50px" color="#000" component="h2">
        CROmagnaDude
        <Typography component="div" fontSize="1.5rem" textAlign="center">
          {totalCounts} / {numberWithCommas(10000)} Minted
        </Typography>
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "200px",
          width: "500px",
          height: "200px",
          backgroundColor: "#cc9dff",
          opacity: 0.9,
          borderRadius: "10px",
        }}
      >
        <TextField
          sx={{ backgroundColor: "white", borderRadius: "4px" }}
          size="small"
          type="number"
          inputProps={{ min: 1, max: 10 }}
          value={mintQuantity}
          onChange={handleQuantity}
        />
        <LoadingButton
          onClick={handleMint}
          loading={isMinting}
          variant="contained"
          sx={{
            ":disabled": {
              backgroundColor: "primary.light",
            },
          }}
        >
          Mint
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default Home;
