import {Typography, Box, Link} from "@mui/material";
import './footer.css';

export default function Footer() {
    return (
        <Box sx={{
            position:"relative",
            left: "0px",
            bottom: "0px",
            width:"100%",
            padding: "2rem 0 4rem 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.25rem",
            '& > :not(style) + :not(style)': {
                ml: 10,
            },
        }}>
          <Typography variant="body2" color="white" sx={{
            position:"fixed",
            bottom: "0px",
            height: "3rem",
            backgroundColor: "#0c0d13",
            width: "100%",
            padding: "1rem 0 1rem 0",
            textAlign: "center",
          }}>
            MoveFlow is
            <Link href="https://github.com/Move-Flow/Audit_report" color="primary" underline="none">
            {' audited'}
            </Link>
            .
        </Typography>
        </Box>
    )
}