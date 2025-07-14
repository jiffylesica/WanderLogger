import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function GuestHome() {
  const router = useRouter();
  const [journeys, setJourneys] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Load guest journeys from localStorage on page load
  useEffect(() => {
    const stored = localStorage.getItem('guestJourneys');
    if (stored) {
      setJourneys(JSON.parse(stored));
    }
  }, []);

  const handleCreate = () => {
    router.push('/guest/journeymaker');
  };

  const handleChange = (panelId) => (e, isExpanded) => {
    setExpanded(isExpanded ? panelId : false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box
  sx={{
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: 2,
    padding: 2,
    mb: 3,
  }}
>
  <Typography variant="body1" sx={{ color: '#856404' }}>
    ⚠️ You&#29;re in <strong>Guest Mode</strong>. Functionality is limited — mock journeys aren&#29;t saved to the cloud, images can&#29;t be uploaded, and shared access is unavailable.
    <br />
    For the full WanderLogger experience, <strong>sign up with your email</strong> to save and revisit your journeys from any device.
  </Typography>
</Box>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        Welcome, Guest! Start Exploring
      </Typography>

      <Box>
        {journeys.length === 0 ? (
          <Typography>No mock journeys yet. Create one below!</Typography>
        ) : (
          journeys.map((journey, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{journey.title || 'Mock Journey'}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {journey.description || 'No description'}
                </Typography>
              </AccordionDetails>
            </Accordion>
            
          ))
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleCreate}
        >
          Create a Mock Journey
        </Button>
      </Box>
    </Container>
  );
}
