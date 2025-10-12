"use client";

import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from '@mui/icons-material/Menu';

const NavDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outlined"
        onClick={ () => setOpen(true) }
        sx={{
          position: 'fixed',
          top: '1rem',
          right: '1rem'
        }}
      >
        <MenuIcon />
      </Button>
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            width: '250px',
            boxSizing: 'border-box',
            gap: '0.5rem'
          },
        }}
      >
        <Button
          color="primary"
          href="/"
        >
          Home
        </Button>
        <Button
          href="/about"
        >
          About this project
        </Button>
        <Button
          sx={{
            marginTop: "auto"
          }}
          href="/contact"
        >
          Contacts
        </Button>

        <Button
          color="secondary"
          variant="contained"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </Drawer>
    </>
  );
};

export default NavDrawer;