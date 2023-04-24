import Box from "@mui/material/Box";
import SvgIcon from '@mui/material/SvgIcon';
import {TwitterIcon, DocIcon, GithubIcon} from "../../../resources";

const URL = {
    github: 'https://github.com/Move-Flow',
    docs: 'https://www.notion.so/MoveFlow-04289bd1e9c94511b3e6c5b8f73c1643',
    twitter: 'https://twitter.com/moveflowlabs'
};

const Link = ({ href, children }: { href: string; children: any }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      style={{textDecoration: "none"}}
      className="flex items-center h6 text-grey-900 opacity-50 gap-2 hover:text-grey-900 hover:opacity-100">
      {children}
    </a>
  );
};

export default function Footer() {
    return (
        <Box sx={{
            position:"fixed",
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
            <Box sx={{
              display: "grid",
              gridTemplateColumns: 'repeat(2, 0.5fr)',
              gap: 1,
            }}>
              <Box>
                <SvgIcon component={TwitterIcon} inheritViewBox />
              </Box>
              <Box>
                <Link href={URL.twitter}>
                  Twitter
                </Link>
              </Box>
            </Box>
            <Box sx={{
              display: "grid",
              gridTemplateColumns: 'repeat(2, 0.5fr)',
              gap: 1,
            }}>
              <SvgIcon component={GithubIcon} inheritViewBox />
              <Link href={URL.github}>
                Github
              </Link>
            </Box>
            <Box sx={{
              display: "grid",
              gridTemplateColumns: 'repeat(2, 0.5fr)',
              gap: 1,
            }}>
              <SvgIcon component={DocIcon} inheritViewBox />
              <Link href={URL.docs}>
                Deck
              </Link>
            </Box>
        </Box>
    )
}