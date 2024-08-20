'use client';

import { useUser } from "@clerk/nextjs";
import db from "../../../firebase";
import {
  Box, Container, Paper, TextField, Typography, Button, Dialog, DialogTitle, DialogContent, CircularProgress,
  DialogContentText, DialogActions, Grid, Card, CardActionArea, CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore";
import ResponsiveAppBar from "../components/ResponsiveAppBar";// Import ResponsiveAppBar

export default function Generate() {
  const { isLoaded, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);  // Set loading to true before fetching
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);  // Set loading to false after fetching (whether it succeeded or failed)
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  return (
    <Container maxWidth="md">

      <ResponsiveAppBar />

      <Box sx={{
        mt: 20,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <Paper sx={{ p: 4, width: '100%' }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            color="secondary"
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            sx={{ backgroundColor: 'black', color: 'white', border: '1px solid black', borderRadius: '50px', '&:hover': { color: 'black', border: '1px solid black' } }}
            onClick={handleSubmit}
            fullWidth
            disabled={loading}  // Disable button while loading
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => {
                    handleCardClick(index);
                  }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flipped[index] ? flashcard.back : flashcard.front}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to flip
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: '50px', padding: '2px 5px', backgroundColor: "white", color: "black", '&:hover': { color: "grey" } }} onClick={handleClose}>Cancel</Button>
          <Button
            sx={{
              borderRadius: '50px', padding: '2px 5px', backgroundColor: "black", color: "white", border: "1px solid black",
              '&:hover': { backgroundColor: "white", color: "black", border: "1px solid black" }
            }}
            onClick={saveFlashcards}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
