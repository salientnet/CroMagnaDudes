import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Web3 from "web3";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import Image from "material-ui-image";

import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import { numberWithCommas, fromWei, toWei } from "../helper/utils";
import {
  totalSupply,
  mint,
  getMintPrice,
  web3Instance,
  tokenURI,
} from "../helper/contract";

const Home = () => {
  const [mintPrice, setMintPrice] = useState<number>(0);
  const [mintQuantity, setMintQuantity] = useState<number>(1);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [totalCounts, setTotalCounts] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newTokenInfo, setNewTokenInfo] = useState<any>(null);
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

    setIsMinting(true);
    const amount = toWei((mintPrice * mintQuantity).toString());

    mint(address, amount, mintQuantity)
      .then(async (res: any) => {
        const tokenId = res.events.Transfer.returnValues.tokenId;
        const uri = await tokenURI(+tokenId);
        const newTokenInfo = await (await fetch(uri)).json();

        setNewTokenInfo(newTokenInfo);
        setIsOpen(true);
        setIsMinting(false);
      })
      .catch((err: any) => {
        console.log(err);
        setIsMinting(false);
        showSnackbar({
          severity: "error",
          message: "Failed to mint",
        });
      });
  };

  const handleQuantity = (e: any) => {
    setMintQuantity(e.target.value);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const modalCustomStyles = {
    overlay: {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      maxWidth: "400px",
      width: "80%",
      borderRadius: "10px",
    },
  };

  const selectOptionsEl = () => {
    const options = [];

    for (let i = 1; i <= 10; i++) {
      options.push(
        <MenuItem value={i} key={i}>
          {i}
        </MenuItem>
      );
    }

    return options;
  };

  useEffect(() => {
    if (address) {
      totalSupply().then((res: any) => {
        setTotalCounts(res);
      });

      getMintPrice().then((price: any) => {
        setMintPrice(parseInt(fromWei(price)));
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
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          style={modalCustomStyles}
          ariaHideApp={false}
        >
          <Typography
            fontSize="2rem"
            fontWeight={600}
            mt="50px"
            mb="20px"
            component="h2"
          >
            New NFT
            <hr />
          </Typography>
          <Typography fontSize="1rem" fontWeight={600} mb="20px" component="h4">
            {newTokenInfo.name}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Image
            src={newTokenInfo.image}
            alt={newTokenInfo.name}
            imageStyle={{ height: "auto", borderRadius: "20px" }}
            aspectRatio={1156 / 1655}
            style={{ borderRadius: "20px" }}
          />
          <Typography mt="20px">{newTokenInfo.description}</Typography>
        </Modal>
      )}
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
        <Select
          value={mintQuantity}
          onChange={handleQuantity}
          sx={{ backgroundColor: "common.white", height: "40px" }}
        >
          {selectOptionsEl()}
        </Select>
        <LoadingButton
          onClick={handleMint}
          loading={isMinting}
          variant="contained"
          sx={{
            height: "40px",
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
