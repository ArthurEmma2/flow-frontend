import {Stack, Box, Paper, Button} from "@mui/material";
import { styled } from '@mui/material/styles';
import Item from "../../Item";

interface WalletSelectorProps {
  wallets: any[]
}



const WalletSelector = ({wallets}: WalletSelectorProps) => {
  return (
    <Box>
      <Stack>
        {wallets.map((val) => {
          return (
            <Item>
              <Button variant="outlined" size="small">{val.name}</Button>
            </Item>
          )
        })}
      </Stack>
    </Box>
  )
}

export default WalletSelector;