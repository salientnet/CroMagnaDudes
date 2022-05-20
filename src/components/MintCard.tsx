import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

interface MintCardProps {
  title: string;
  mintPrice: number;
  imgSrc: string;
  mintQuantity: number;
  isMinting: boolean;
  disabled: boolean;
  styles?: any;
  handleQuantity: (event: any) => void;
  handleMint: () => void;
}

const MintCard = (props: MintCardProps) => {
  const {
    title,
    mintPrice,
    imgSrc,
    mintQuantity,
    isMinting,
    disabled,
    styles,
    handleQuantity,
    handleMint,
  } = props;

  const optionsEl = () => {
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

  return (
    <Card
      sx={{
        ...styles,
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{
              fontSize: "24px",
              fontFamily: "'sOuTh Afirkas 2100'",
              color: "text.secondary",
            }}
          >
            {title}
          </Box>
        }
        subheader={
          <Box
            sx={{
              fontSize: "14px",
              fontFamily: "'sOuTh Afirkas 2100'",
              color: "text.secondary",
            }}
          >
            {mintPrice} CRO / count
          </Box>
        }
        sx={{
          textAlign: "right",
        }}
      />
      <CardMedia
        component="img"
        image={imgSrc}
        alt={title}
        sx={{
          height: "330px",
          padding: "15px 0",
        }}
      />
      <CardActions>
        <Select
          value={mintQuantity}
          onChange={(event) => handleQuantity(event)}
          sx={{
            color: "secondary.main",
            backgroundColor: "common.white",
            width: "70px",
            height: "40px",
          }}
        >
          {optionsEl()}
        </Select>
        <LoadingButton
          onClick={() => handleMint()}
          loading={isMinting}
          disabled={disabled}
          variant="contained"
          color="secondary"
          sx={{
            height: "40px",
            minWidth: "70px",
            "&:hover": {
              backgroundColor: "#343232",
            },
          }}
        >
          Mint
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default MintCard;
