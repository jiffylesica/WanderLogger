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
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import db from '@/lib/db';

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
          sx={{
            mt: 4,
            border: '1px solid #ccc',
            borderRadius: 1,
            padding: 3,
            backgroundColor: '#fafafa',
          }}
        >
          {localJourneys.length === 0 ? (
            <Box sx={{ pl: 0.5, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" fontWeight={300}>
                No journeys yet. Start one below!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pl: 0.5, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" fontWeight={300}>
                My Journeys
              </Typography>
              {localJourneys.map((journey) => (
                <Accordion
                  key={journey.id}
                  expanded={expanded === journey.id}
                  onChange={handleChange(journey.id)}
                  sx={{ mt: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      {journey.journey_title || 'Untitled Journey'}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography sx={{ mb: 1 }}>
                      {journey.journey_description ||
                        'No Description Available'}
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
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ height: '56px', mt: 3 }}
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
const serializeDates = (obj) => {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result;
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const journeys = await db('journeys').where({ user_id: session.user.id });

    // ✅ Safely serialize dates BEFORE returning
    return {
      props: {
        journeys: journeys.map(serializeDates),
      },
    };
  } catch (err) {
    console.error('Failed to load journeys on homepage:', err);
    return {
      props: {
        journeys: [],
      },
    };
  }
}
