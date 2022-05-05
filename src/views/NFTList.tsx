import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import Web3 from "web3";
import { Box, Grid, Typography, Chip, Stack } from "@mui/material";
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
import { fromWei } from "../helper/utils";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import Loading from "../components/Loading";
import ImageLoading from "../components/ImageLoading";

const NFTList = () => {
  const { address } = useAuthContext();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [noNFT, setNoNFT] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [countByUser, setCountsByUser] = useState<string>("0");
  const [reflectionBalances, setReflectionBalances] = useState<string>("0");
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

  const claim = () => {
    setIsClaiming(true);

    claimRewards(address)
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

  useEffect(() => {
    const fetchNFTData = async () => {
      setIsLoading(true);

      try {
        const nftCounts = await balanceOf(address);
        setCountsByUser(nftCounts);

        if (+nftCounts === 0) {
          setNoNFT(true);
          setIsLoading(false);
          return;
        }

        const reflections = await getReflectionBalances(address);
        setReflectionBalances(parseFloat(fromWei(reflections)).toFixed(2));

        let tokenIds = [] as any;
        for (let index = 0; index < +nftCounts; index++) {
          tokenIds.push(await tokenOfOwnerByIndex(address, index));
        }

        const tokenURIs = await Promise.all(
          tokenIds.map((id: any) => tokenURI(id))
        );

        const tokensInfo = await Promise.all(
          tokenURIs.map(async (uri: string) => (await fetch(uri)).json())
        );

        setTokens(tokensInfo);
        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        showSnackbar({
          severity: "error",
          message: "Failed to fetch data",
        });
      }
    };

    if (address) {
      fetchNFTData();
    }
  }, [address]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "#de8e4b",
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
              <Typography component="h2" fontSize="2rem" color="#fff" textTransform="capitalize">
                Total counts minted
              </Typography>
              <Typography fontSize="2rem" fontWeight={600} color="#fff">
                {countByUser}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h2" fontSize="2rem" color="#fff" textTransform="capitalize">
                Total rewards
              </Typography>
              <Typography
                fontSize="2rem"
                fontWeight={600}
                mb="20px"
                color="#fff"
              >
                {reflectionBalances}
              </Typography>
              <LoadingButton
                onClick={claim}
                loading={isClaiming}
                variant="contained"
                disabled={parseFloat(reflectionBalances) === 0}
              >
                Claim
              </LoadingButton>
            </Box>
          </Box>
          {noNFT ? (
            <Box>
              <Typography fontSize="2rem" color="#fff" textAlign="center">
                No Results
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {tokens.map((token: any) => (
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
