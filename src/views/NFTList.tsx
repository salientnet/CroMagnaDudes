import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import Web3 from "web3";
import { Box, Grid, Typography, Chip, Stack } from "@mui/material";
import Image from "material-ui-image";

import {
  balanceOf,
  tokenOfOwnerByIndex,
  tokenURI,
  web3Instance,
} from "../helper/contract";
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
              trait.value === "NONE" ||
              trait.value === "None" ||
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

  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);

      try {
        const nftCounts = await balanceOf(address);

        if (!nftCounts.length) {
          setNoNFT(true);
          setIsLoading(false);
          return;
        }

        let tokenIds = [] as any;
        for (let index = 0; index < nftCounts; index++) {
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
      fetchNFTs();
    }
  }, [address]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {noNFT ? (
            <Box>
              <Typography>No Results</Typography>
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
        </div>
      )}
    </>
  );
};

export default NFTList;
