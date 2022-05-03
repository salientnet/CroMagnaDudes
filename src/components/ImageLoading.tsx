import { Stack, Skeleton } from "@mui/material";

const ImageLoading = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        padding: "20px",
      }}
    >
      <Skeleton
        height="200px"
        variant="rectangular"
        animation="wave"
        sx={{
          marginBottom: "10px",
        }}
      />
      <Skeleton height="30px" variant="text" animation="wave" />
      <Skeleton height="30px" variant="text" animation="wave" />
    </Stack>
  );
};

export default ImageLoading;
