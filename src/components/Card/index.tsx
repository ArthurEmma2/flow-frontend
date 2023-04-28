import { Card, CardContent } from "@mui/material";
import {ReactNode} from "react";
import Typography from "@mui/material/Typography";


interface CardProp {
  children: ReactNode;
  content: string;
}

const MyCard = ({children, content}: CardProp) => {
  return (
    <Card sx={{height: "100%", width: "100%"}}>
      <CardContent>
        {children}
        <Typography>
          {content}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MyCard;