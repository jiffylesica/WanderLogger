// Homepage
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home({ journeys }) {
  const router = useRouter();

  const handleEdit = (id) => {
    router.push(`/journeymaker?id=${id}`);
  };

  const handleCreate = () => {
    router.push(`/journeymaker`);
  };

  // State to manage accordion openings
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panelId) => (e, isExpanded) => {
    setExpanded(isExpanded ? panelId : false);
  };

  // Deleting Journey
  const [dialogOpen, setDialogOpen] = useState(false);
  const [journeyToDelete, setJourneyToDelete] = useState(null);
  const [localJourneys, setLocalJourneys] = useState(journeys);

  return (
    <>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Delete Journey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this journey? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={async () => {
              try {
                await fetch(`/api/journeys/${journeyToDelete}`, {
                  method: 'DELETE',
                });
                setLocalJourneys(
                  localJourneys.filter((j) => j.id !== journeyToDelete)
                );
              } catch (err) {
                console.error('Failed to delete journey:', err);
              }
              setDialogOpen(false);
              setJourneyToDelete(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 400,
            mb: 1,
            color: 'text.primary',
          }}
        >
          Welcome to the WanderLogger, Your Digital Travel Log
        </Typography>

        <Box
          fullWidth
          sx={{
            mt: 4,
            border: '1px solid #ccc',
            borderRadius: 1,
            padding: 3,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography>My Journeys</Typography>
          {localJourneys.map((journey) => (
            <Accordion
              key={journey.id}
              expanded={expanded === journey.id}
              onChange={handleChange(journey.id)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {journey.journey_title || 'Untitled Journey'}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ mb: 1 }}>
                  {journey.journey_description || 'No Description Available'}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleEdit(journey.id)}
                >
                  Edit Journey
                </Button>

                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  sx={{ ml: 0.5 }}
                  onClick={() => {
                    setJourneyToDelete(journey.id);
                    setDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button
            variant="contained"
            fullWidth
            sx={{ height: '56px', mt: 4 }}
            onClick={() => handleCreate()}
          >
            Create a New Journey
          </Button>
        </Box>
      </Container>
    </>
  );
}

// Server side function that runs on server before page loads
// Allows to pass data into page as props (when no parent)
export async function getServerSideProps() {
  // Make request to API route to retrieve journeys (or local for development)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/journeys`
  );

  // Convert HTTP response to js object
  const data = await res.json();

  return {
    props: {
      journeys: data.journeys || [],
    },
  };
}
