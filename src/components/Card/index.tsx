import {Box, Card, CardContent} from "@mui/material";
import React, {ReactNode} from "react";
import Typography from "@mui/material/Typography";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";


interface CardProp {
  children: ReactNode;
  content: ReactNode;
  cardStyle?: SxProps<Theme>;
}

const MyCard = ({children, content, cardStyle}: CardProp) => {
  return (
    <React.Fragment>
      <Box>
        <Card sx={cardStyle}>
          <CardContent component="div">
            {children}
            {content}
          </CardContent>
        </Card>
      </Box>

    </React.Fragment>
  )
}

export default MyCard;