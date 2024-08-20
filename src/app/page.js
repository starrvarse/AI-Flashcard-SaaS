'use client'

import Image from "next/image";
import getStripe from "../../utils/get-stripe";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Container, Button, Typography, Box, Grid, Link } from "@mui/material";
import Head from "next/head";
import heroImg from '../../public/hero-img.png';
import card1 from '../../public/card1.png';
import card2 from '../../public/card2.png';
import card3 from '../../public/card3.png';
import freeTier from '../../public/freetier.png';
import paidTier from '../../public/paidtier.png';
import ResponsiveAppBar from "./components/ResponsiveAppBar";


export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' }, 
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>FlashcardAI</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      {/* ResponsiveAppBar for Navbar */}
      <ResponsiveAppBar />

      {/* start home */}
      <Box sx={{ textAlign: 'center', my: 10 }} id='home'>
        <Image src={heroImg} width={300} height={360} sx={{objectFit: 'cover'}} alt=""></Image>
        <Typography variant="h3" sx={{color: '#18BDCA', mt: 5}} gutterBottom>Empower Your Learning Journey with <strong>Flashcard AI</strong></Typography>
        <Typography  sx={{padding: '4px 100px', textAlign: 'center', fontWeight: '300px'}} variant="h6" gutterBottom>Revolutionize Your Study Sessions with Intelligent Flashcards Tailored to Unlock Your Full Potential.</Typography>
        <Button variant="contained" sx={{mt: 5, fontSize:'16px', backgroundColor: '#18BDCA', color: 'white', border: '1px solid #18BDCA', marginRight: '20px', borderRadius: '50px',
        '&:hover': {
          backgroundColor: 'white',
          color: '#18BDCA', 
          border: '1px solid #18BDCA'
        }, mb: 10}} onClick={() => scrollToSection('pricing')}>
          Get Started
        </Button>
        <Button variant="outlined"  sx={{mt: 5, fontSize:'16px', backgroundColor: 'white', color: '#18BDCA', border: '1px solid #18BDCA', marginRight: '20px', borderRadius: '50px',
        '&:hover': {
          backgroundColor: '#18BDCA', 
          color: 'white', 
          border: '1px solid white', 
        }, mb: 10}} onClick={() => scrollToSection('features')}>
          Learn More
        </Button>
      </Box>
      {/* end home  */}

      <Container sx={{ textAlign: 'center', my:20}}  id="features">
        <Box sx={{ my: 6 }}>
          <Typography variant="h3" gutterBottom><strong>Features</strong></Typography>
          <Grid container spacing={4} sx={{mt: 3, mb: 15}}>
            <Grid item xs={12} md={4} sx={{height: '550px'}}>
              <Image width={300} sx={{borderRadius: '16px'}} src={card1} alt=""></Image>
              <Typography variant="h5" gutterBottom>Easy Text Input</Typography>
              <Typography>
                Simply input your text and let our software do the rest.
                Creating flashcards has never been easier.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{height: '550px'}}>
              <Image width={300} sx={{borderRadius: '16px'}} src={card2} alt=""></Image>
              <Typography variant="h5" gutterBottom>Smart Flashcards</Typography>
              <Typography>
                Our AI intelligently breaks down your text
                into concise flashcards, perfect for studying.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{height: '550px'}}>
            <Image width={300} sx={{borderRadius: '16px'}} src={card3} alt=""></Image>
              <Typography variant="h5" gutterBottom>Accessible Anywhere</Typography>
              <Typography>
                Access your flashcards from any device, at any time.
                Study on the go with ease.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Container sx={{ textAlign: 'center', my:20}} id="pricing">
        <Box sx={{ my: 6, textAlign: 'center'}}>
          <Typography variant="h3" gutterBottom><strong>Pricing</strong></Typography>
          <Grid container spacing={4} justifyContent="center" sx={{mt: 3}}>
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}>
                <Image src={freeTier} alt="" width={200}/>
                <Typography variant="h4" ><strong>Basic Plan</strong></Typography>
                <Typography variant="h6" gutterBottom>$0 / month</Typography>
                <Typography>
                  Get started with our free plan, which includes basic flashcard creation features
                  and limited storage.
                </Typography>
                <Button  sx={{
                      fontSize: '16px',
                      backgroundColor: 'black',
                      color: 'white',
                      border: '1px solid black',
                      marginRight: '20px',
                      borderRadius: '50px',
                      width: '200px',
                      mt: 2,
                      '&:hover': {
                        backgroundColor: 'white',
                        color: 'black', 
                        border: '1px solid black',
                      },
                    }} href="/generate">
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}>
                <Image src={paidTier} alt="" width={200}/>
                <Typography variant="h4"><strong>Pro Plan</strong></Typography>
                <Typography variant="h6" gutterBottom>$1.00 / month</Typography>
                <Typography>
                  Upgrade to the Pro Plan for more advanced features, including unlimited flashcards and AI-enhanced study modes.
                </Typography>
                <Button
                    sx={{
                      fontSize: '16px',
                      backgroundColor: 'black',
                      color: 'white',
                      border: '1px solid black',
                      marginRight: '20px',
                      borderRadius: '50px',
                      width: '200px',
                      mt: 2,
                      '&:hover': {
                        backgroundColor: 'white',
                        color: 'black', 
                        border: '1px solid black',
                      },
                    }} 
                onClick={handleSubmit}>
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}