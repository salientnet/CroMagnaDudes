import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

import { useAuthContext } from "../contexts/AuthContext";
import { minimizeAddress } from "../helper/utils";

const Connect = () => {
  const { address, loading, connect, disconnect } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    handleClose();
    disconnect();
  };

  return (
    <>
      {address ? (
        <div>
          <Button variant="contained" color="primary" onClick={handleClick}>
            {minimizeAddress(address)}
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
          </Menu>
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={connect}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default Connect;
