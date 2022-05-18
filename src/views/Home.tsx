import { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Web3 from "web3";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import Image from "material-ui-image";

import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import { NFT_TYPE } from "../helper/types";
import { numberWithCommas, fromWei, toWei } from "../helper/utils";
import {
  totalSupply,
  mint,
  getMintPrice,
  web3Instance,
  tokenURI,
} from "../helper/contract";
import ImageLoading from "../components/ImageLoading";
import StoneAgeImage from "../assets/images/stone_age.png";
import MintCard from "../components/MintCard";

const Home = () => {
  const { address } = useAuthContext();
  const { showSnackbar } = useSnackbar();

  const [tierPrice, setTierPrice] = useState({
    [NFT_TYPE.TIER_1]: 0,
    [NFT_TYPE.TIER_2]: 0,
    [NFT_TYPE.TIER_3]: 0,
  });
  const [quantity, setQuantity] = useState({
    [NFT_TYPE.TIER_1]: 1,
    [NFT_TYPE.TIER_2]: 1,
    [NFT_TYPE.TIER_3]: 1,
  });
  const [minting, setMinting] = useState<NFT_TYPE | undefined>(undefined);

  // const [totalCounts, setTotalCounts] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newTokenInfo, setNewTokenInfo] = useState<any>(null);

  web3Instance.setProvider(Web3.givenProvider);

  const handleMint = (type: NFT_TYPE) => {
    if (!address) {
      showSnackbar({
        severity: "error",
        message: "Please connect your wallet",
      });

      return;
    }

    setMinting(type);

    const amount = toWei((tierPrice[type] * quantity[type]).toString());

    mint(address, amount, quantity[type], type)
      .then(async (res: any) => {
        const tokenId = res.events.Transfer.returnValues.tokenId;
        const uri = await tokenURI(+tokenId, type);
        const newTokenInfo = await (await fetch(uri)).json();

        setNewTokenInfo(newTokenInfo);
        setIsOpen(true);
        setMinting(undefined);
      })
      .catch((err: any) => {
        console.error(err);
        setMinting(undefined);
        showSnackbar({
          severity: "error",
          message: "Failed to mint",
        });
      });
  };

  const handleQuantity = (e: any, type: NFT_TYPE) => {
    setQuantity((v) => ({
      ...v,
      [type]: e.target.value,
    }));
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

  useEffect(() => {
    if (address) {
      // totalSupply().then((res: any) => {
      //   setTotalCounts(res);
      // });

      Promise.all([
        getMintPrice(NFT_TYPE.TIER_1),
        getMintPrice(NFT_TYPE.TIER_2),
        getMintPrice(NFT_TYPE.TIER_3),
      ]).then(([tier1Price, tier2Price, tier3Price]) => {
        setTierPrice({
          [NFT_TYPE.TIER_1]: parseFloat(fromWei(tier1Price)),
          [NFT_TYPE.TIER_2]: parseFloat(fromWei(tier2Price)),
          [NFT_TYPE.TIER_3]: parseFloat(fromWei(tier3Price)),
        });
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
            loading={<ImageLoading />}
            style={{ borderRadius: "20px" }}
          />
          <Typography mt="20px">{newTokenInfo.description}</Typography>
        </Modal>
      )}
      {/* <Typography fontSize="3rem" mt="50px" color="#000" component="h2">
        CROmagnaDude
        <Typography component="div" fontSize="1.5rem" textAlign="center">
          {totalCounts} / {numberWithCommas(10000)} Minted
        </Typography>
      </Typography> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: "100px",
          width: "100%",
          backgroundColor: "#b4b8ba",
          borderRadius: "10px",
          padding: "30px",
        }}
      >
        {Object.values(NFT_TYPE).map((type) => (
          <MintCard
            title={`${type} Age`}
            mintPrice={tierPrice[type]}
            imgSrc={StoneAgeImage}
            mintQuantity={quantity[type]}
            isMinting={!!minting && minting === type}
            disabled={!!minting && minting !== type}
            handleQuantity={(e) => handleQuantity(e, type)}
            handleMint={() => handleMint(type)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Home;
