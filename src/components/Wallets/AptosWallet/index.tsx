import React from "react";
import {Box, Button, Popover, Stack} from "@mui/material";
import WalletSelector from "../WalletSelector";
import Item from "../../Item";


export default function AptosWalletButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const connected = true;
  const wallets = [
    {
      name: "pontem",
    },
    {
      name: "martian",
    }
  ]

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleUserClose = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        aria-describedby={id}
        onClick={handleUserClick}
      >
        Connect Wallet
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleUserClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          marginTop: 1
        }}
      >
        {connected ?
          <Box>
            <Stack>
              <Item>
                <Button variant="outlined" size="small">Disconnect</Button>
              </Item>
            </Stack>
          </Box>

          :
          <Stack spacing={2}>
            <WalletSelector wallets={wallets}/>
          </Stack>
        }
      </Popover>
    </>
  )
}