import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import Web3 from "web3";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Image from "material-ui-image";

import {
  balanceOf,
  tokenOfOwnerByIndex,
  tokenURI,
  web3Instance,
  getReflectionBalances,
  claimRewards,
} from "../helper/contract";
import { NFT_TYPE } from "../helper/types";
import { fromWei } from "../helper/utils";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import Loading from "../components/Loading";
import ImageLoading from "../components/ImageLoading";

const NFTList = () => {
  const { address } = useAuthContext();
  const { showSnackbar } = useSnackbar();

  const [nftType, setNftType] = useState(NFT_TYPE.TIER_1);
  const [isLoading, setIsLoading] = useState(false);

  const [nftCounts, setNftCounts] = useState({
    [NFT_TYPE.TIER_1]: "0",
    [NFT_TYPE.TIER_2]: "0",
    [NFT_TYPE.TIER_3]: "0",
  });

  const [noNFT, setNoNFT] = useState({
    [NFT_TYPE.TIER_1]: false,
    [NFT_TYPE.TIER_2]: false,
    [NFT_TYPE.TIER_3]: false,
  });

  const [reflectionBalances, setReflectionBalances] = useState({
    [NFT_TYPE.TIER_1]: "0",
    [NFT_TYPE.TIER_2]: "0",
    [NFT_TYPE.TIER_3]: "0",
  });

  const [tokens, setTokens] = useState({
    [NFT_TYPE.TIER_1]: [],
    [NFT_TYPE.TIER_2]: [],
    [NFT_TYPE.TIER_3]: [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);

  const [isClaiming, setIsClaiming] = useState(false);

  web3Instance.setProvider(Web3.givenProvider);

  const showLightBox = (token: any) => {
    setIsOpen(true);
    setSelectedToken(token);
  };

  const showNFTDetail = (description: string, traits: any) => {
    return (
      <>
        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {traits.map((trait: any) => {
            if (
              trait.value.toLowerCase() === "none" ||
              trait.trait_type === "body"
            ) {
              return <></>;
            }

            return (
              <Chip
                label={trait.value}
                key={trait.trait_type}
                color="primary"
                sx={{ marginBottom: "10px !important" }}
              />
            );
          })}
        </Stack>
        <div>{description}</div>
      </>
    );
  };

  const changeType = (e: any) => {
    setNftType(e.target.value);
  };

  const claim = (type: NFT_TYPE) => {
    setIsClaiming(true);

    claimRewards(address, type)
      .then((res: any) => {
        setIsClaiming(false);
        showSnackbar({
          severity: "success",
          message: "You got the rewards",
        });
      })
      .catch((err: any) => {
        setIsClaiming(false);
        showSnackbar({
          severity: "error",
          message: "Failed to claim",
        });
      });
  };

  const fetchNFTData = async (type: NFT_TYPE) => {
    setIsLoading(true);

    try {
      const counts = await balanceOf(address, type);
      setNftCounts((v) => ({
        ...v,
        [type]: counts,
      }));

      if (+counts === 0) {
        setNoNFT((v) => ({
          ...v,
          [type]: true,
        }));
        setIsLoading(false);

        return;
      }

      const reflections = await getReflectionBalances(address, type);
      setReflectionBalances((v) => ({
        ...v,
        [type]: parseFloat(fromWei(reflections)).toFixed(2),
      }));

      let tokenIds = [] as any;
      for (let index = 0; index < +counts; index++) {
        tokenIds.push(await tokenOfOwnerByIndex(address, index, type));
      }

      const tokenURIs = await Promise.all(
        tokenIds.map((id: any) => tokenURI(id, type))
      );

      const tokensInfo = await Promise.all(
        tokenURIs.map(async (uri: string) => (await fetch(uri)).json())
      );
      setTokens((v) => ({
        ...v,
        [type]: tokensInfo,
      }));

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      showSnackbar({
        severity: "error",
        message: "Failed to fetch data",
      });
    }
  };

  useEffect(() => {
    if (address) {
      fetchNFTData(nftType);
    }
  }, [address, nftType]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Select
            value={nftType}
            onChange={changeType}
            sx={{
              backgroundColor: "common.white",
              marginBottom: "16px",
              minWidth: "150px",
            }}
          >
            {Object.values(NFT_TYPE).map((type, key) => (
              <MenuItem value={type} key={key}>
                {`${type} Age`}
              </MenuItem>
            ))}
          </Select>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "#b4b8ba",
              height: "300px",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "50px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                component="h2"
                fontSize="2rem"
                color="#fff"
                textTransform="capitalize"
              >
                Total counts minted
              </Typography>
              <Typography fontSize="2rem" fontWeight={600} color="#fff">
                {nftCounts[nftType]}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                component="h2"
                fontSize="2rem"
                color="#fff"
                textTransform="capitalize"
              >
                Total rewards
              </Typography>
              <Typography
                fontSize="2rem"
                fontWeight={600}
                mb="20px"
                color="#fff"
              >
                {reflectionBalances[nftType]}
              </Typography>
              <LoadingButton
                onClick={() => claim(nftType)}
                loading={isClaiming}
                variant="contained"
                disabled={parseFloat(reflectionBalances[nftType]) === 0}
              >
                Claim
              </LoadingButton>
            </Box>
          </Box>
          {noNFT[nftType] ? (
            <Box>
              <Typography fontSize="2rem" color="#fff" textAlign="center">
                No Results
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {tokens[nftType].map((token: any) => (
                <Grid
                  item
                  key={token.name}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ cursor: "pointer" }}
                >
                  <Image
                    src={token.image}
                    alt={token.name}
                    imageStyle={{ height: "auto", borderRadius: "20px" }}
                    aspectRatio={1156 / 1655}
                    style={{ borderRadius: "20px" }}
                    loading={<ImageLoading />}
                    onClick={() => showLightBox(token)}
                  />
                </Grid>
              ))}
              {isOpen && (
                <Lightbox
                  imageCaption={showNFTDetail(
                    selectedToken.description,
                    selectedToken.attributes
                  )}
                  mainSrc={selectedToken.image}
                  imageTitle={selectedToken.name}
                  onCloseRequest={() => setIsOpen(false)}
                />
              )}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default NFTList;
