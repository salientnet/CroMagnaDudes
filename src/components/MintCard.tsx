import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Select,
  MenuItem,
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
        maxWidth: "300px",
        backgroundColor: "grey.300",
      }}
    >
      <CardHeader
        title={title}
        subheader={`${mintPrice} CRO / count`}
        sx={{ textAlign: "center" }}
      />
      <CardMedia
        component="img"
        image={imgSrc}
        alt={title}
        sx={{
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "grey.400",
        }}
      />
      <CardActions sx={{ justifyContent: "space-around" }}>
        <Select
          value={mintQuantity}
          onChange={(event) => handleQuantity(event)}
          sx={{
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
          sx={{
            height: "40px",
          }}
        >
          Mint
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default MintCard;
