import * as React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import Image from 'next/image';
import flashCard from '../../../public/flash-card.png';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";

// Define pages with custom href values
const pages = [
  { label: 'PRODUCT', href: '/#features' },
  { label: 'PRICING', href: '/#pricing' },
  { label: 'DASHBOARD', href: '/flashcards' },  
  { label: 'GENERATE', href: '/generate' }
];

export default function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <Head>
        <title>FlashPrepAI</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar elevation={0} sx={{ backgroundColor: 'white', color: 'black' }} position="fixed">
        <Toolbar>
          {/* Logo and Brand */}
          <Typography 
            variant="h6" 
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              color: 'black',
              textDecoration: 'none',
              gap: '10px',
            }} 
            style={{ flexGrow: 1 }} 
          >
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
              <Image src={flashCard} width={38} height={38} alt="Logo"/>
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>FlashPrepAI</Typography>
            </Link>
          </Typography>

          {/* Navbar for large screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Link key={page.label} href={page.href} passHref>
                <Button
                  sx={{
                    color: 'black', 
                    display: 'block', 
                    mx: 1, 
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  {page.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* User button and Mobile menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button 
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  px: 3,
                  ml: 2,
                  '&:hover': {
                    backgroundColor: 'grey',
                  },
                }} 
                href="/sign-in"
              >
                GET STARTED
              </Button>
            </SignedOut>
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Link href={page.href} passHref>
                    <Typography textAlign="center">{page.label}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}