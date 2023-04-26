import React from "react";
import {Stack, Box, Grid, Paper, Typography, Container} from "@mui/material";
import OutgoingPic from '../../resources/outgoing.png';
import DashboardPic from '../../resources/dashboard.png';
import StreamPic from '../../resources/stream.png';
import NonceGeekLogo from '../../resources/icons/noncegeek.png';
import {AntAlphaLogo, AntAlphaTitle, AptosLogo, ZonffLogo, Logo706} from '../../resources';

const Home = () => {
  return (
    <Container>
      <Stack spacing={5}>
        <Container >
          <Typography variant="h2" color="text.secondary">Streaming payments on</Typography>
          <Typography variant="h3" color="text.secondary">Move Ecosystem</Typography>
          <Typography variant="body1" color="text.secondary" sx={{width: "50%"}}>
            MoveFlow is a revolutionary crypto asset streaming protocol built on Move ecosystem. Through our continuous payment technology, we are changing the way you send and receive money.
          </Typography>
        </Container>
        <Paper elevation={0} sx={{ paddingLeft: 10, paddingRight: 10}}>
          <Grid container spacing={5} sx={{width: "100%"}}>
            <Grid item lg={4} textAlign="center">
                <Typography variant="h5" color="text.secondary">Token Distribution Platform</Typography>
                <Typography variant="body1" color="text.secondary">Cutting-edge DeFi platform which is built on move ecosystems including Aptos and Sui that enables instantaneous, seamless, and uninterrupted payment streams.</Typography>
            </Grid>
            <Grid item lg={8}>
              <div className="flex justify-end">
                <img src={DashboardPic} alt="Dashboard" loading="lazy" style={{width: "100%",  right: 0}}/>
              </div>
            </Grid>
            <Grid item lg={8}>
                <img src={OutgoingPic} alt="Outgoing" loading="lazy" style={{width: "100%"}}/>
            </Grid>
            <Grid item lg={4} textAlign="center">
              <Typography variant="h5" color="text.secondary">Token Vesting</Typography>
              <Typography variant="body1" color="text.secondary">Token vesting with Moveflow offers powerful features like cliff dates, transferable streams, automatic withdrawals and much more.</Typography>
            </Grid>
            <Grid item lg={4} textAlign="center">
              <Typography variant="h5" color="text.secondary">Stream Payments</Typography>
              <Typography variant="body1" color="text.secondary">The automated payment streams facilitated by Moveflow offer business, employees, and consumers the ability to completely transform the way they receive payments, invest, and purchase goods and services.</Typography>
            </Grid>
            <Grid item lg={8}>
                <img src={StreamPic} alt="Stream" style={{width: "100%"}}/>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={0}>
          <Typography variant="h2" color="text.secondary">Trusted By Our Partners</Typography>
        </Paper>
        <Paper elevation={0}>
          <Grid container spacing={8} >
            <Grid lg={1}></Grid>
            <Grid lg={2} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              {/*<Container sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>*/}
                <img src={NonceGeekLogo} alt="NonceGeek" style={{width: "100%"}}/>
              {/*</Container>*/}
            </Grid>
            <Grid lg={2} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <AntAlphaLogo />
                <AntAlphaTitle fill="white" stroke="white"/>
              </Box>
            </Grid>
            <Grid lg={2} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <ZonffLogo fill="black" stroke="black"/>
            </Grid>
            <Grid lg={2} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <AptosLogo style={{width: "100%"}}/>
            </Grid>
            <Grid lg={2} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Logo706 style={{height: '100%', width: '100%'}}/>
            </Grid>
            <Grid lg={1}></Grid>
          </Grid>
        </Paper>
        <Paper elevation={0}>
          <Typography variant="h2" color="text.secondary">Developer</Typography>
          <div className="justify-center items-center">
            <Typography variant="body1" color="text.secondary">Build On Moveflow</Typography>
            <Typography variant="body1" color="text.secondary">Use our SDK to enable dApp with payment streaming features or create a novel use case.</Typography>
          </div>
        </Paper>
        <Paper elevation={0}>
          <Typography variant="h2" color="text.secondary">Meet the team</Typography>
          <div className="justify-center items-center">
            <Typography variant="body1" color="text.secondary">About</Typography>
            <Typography variant="body1" color="text.secondary">The moveflow team is a passionate, dedicated team of glass eaters with a strong belief in the larger vision of the streaming primitive and driven to unlock this value of the world.</Typography>
          </div>
        </Paper>
      </Stack>










          {/*<div className="flex flex-wrap justify-center mt-3 gap-10">*/}
          {/*  {*/}
          {/*    developerInfoList.map((developer, idx) => {*/}
          {/*      return (*/}
          {/*        <Card*/}
          {/*          key={idx}*/}
          {/*          variant="outlined"*/}
          {/*          orientation="horizontal"*/}
          {/*          sx={{*/}
          {/*            width: 280,*/}
          {/*            gap: 9,*/}
          {/*            '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <AspectRatio ratio="1" sx={{ width: 90 }}>*/}
          {/*            <img*/}
          {/*              src={developer.avatar}*/}
          {/*              loading="lazy"*/}
          {/*              alt=""*/}
          {/*            />*/}
          {/*          </AspectRatio>*/}
          {/*          <div>*/}
          {/*            <Typography level="h2" fontSize="lg" id="card-description" mb={0.5} mt={2.5}>*/}
          {/*              {developer.name}*/}
          {/*            </Typography>*/}
          {/*            <Typography fontSize="sm" aria-describedby="card-description" mb={1} sx={{ color: 'text.tertiary' }}>*/}
          {/*              {developer.role}*/}
          {/*            </Typography>*/}
          {/*          </div>*/}
          {/*        </Card>*/}
          {/*      )*/}
          {/*    })*/}
          {/*  }*/}
          {/*</div>*/}
    </Container>
  )
}

export default Home;