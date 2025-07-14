// useState lets component remember values between renders
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
// Have to wait to load map component on window bc leaflet renders on window
import dynamic from 'next/dynamic';
import {
  Container,
  Typography,
  Button,
  TextField,
  TextareaAutosize,
  Stack,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MapButtonBar from '../components/MapButtonBar';
import PinDetailPanel from '../components/PinDetailPanel';

// This basically says don't try to load the map component on the server side, wait until on browser
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

// Export defines the react component for the page
// uses jsx within return
export default function JourneyMaker() {
  // Store array of pin objects
  /*
    1. pins = state variable
    2. setPins is function to update pins
    3. Initialize to empty array
    */
  const [pins, setPins] = useState([]);

  // Toggle for dropping pins
  const [dropPinsEnabled, setDropPinsEnabled] = useState(false);

  // Journey Title and Description State
  const [JourneyTitle, setJourneyTitle] = useState('');
  const [JourneyDescription, setJourneyDescription] = useState('');

  // Add centering to move map to selected location
  const [center, setCenter] = useState([0, 0]);
  const [bounds, setBounds] = useState(null);

  // Add zoom state to prevent map rezooming
  const [zoom, setZoom] = useState(2);

  // Search bar states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Pin states for active pins
  const [activePin, setActivePin] = useState(null);
  const [isPinPanelOpen, setIsPinPanelOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Search bar position
  const searchBarRef = useRef(null);
  const [dropDownPosition, setDropDownPosition] = useState({ top: 0, left: 0 });

  const router = useRouter();
  const journeyId = router.query.id;

  const saveJourney = async () => {
    if (!JourneyTitle.trim()) {
      console.warn('Journey title is required to save');
      return;
    }
    try {
      const method = journeyId ? 'PUT' : 'POST';
      const endpoint = journeyId ? `api/journeys/${journeyId}` : 'api/journeys';
      const journeyResponse = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          journey_title: JourneyTitle,
          journey_description: JourneyDescription,
        }),
      });

      const journeyData = await journeyResponse.json();
      // Get id returned by json response
      const savedJourneyId = journeyData.journey.id;

      // Save each pin associated with journey
      for (const pin of pins) {
        const pinResponse = await fetch('/api/pins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            journey_id: savedJourneyId,
            pin_title: pin.title || '',
            pin_description: pin.description || '',
            latitude: pin.latitude,
            longitude: pin.longitude,
            date_traveled: pin.date || null,
            image_url: pin.image_url || '',
          }),
        });

        const pinData = await pinResponse.json();
        console.log('Saved pin:', pinData.pin);
      }

      if (journeyResponse.ok) {
        console.log('Journey Created:', journeyData.journey);
      } else {
        console.error('Error creating journey:', journeyData.error);
      }
    } catch (err) {
      console.error('Network Error:', err);
    }
  };

  const handleSearch = async (e) => {
    console.log('Search button clicked with query:', searchQuery);
    // response based on users typed query
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
    );
    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('API response:', data);
    // Retrieve search reslts and store them in results
    setSearchResults(data);

    if (searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect();
      setDropDownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left,
      });
    }
  };

  // To close search on click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadJourney = async () => {
      if (!journeyId || isNaN(Number(journeyId))) return;
      try {
        // Fetch journey
        const res = await fetch(`/api/journeys/${journeyId}`);
        const data = await res.json();
        setJourneyTitle(data.journey.journey_title);
        setJourneyDescription(data.journey.journey_description);

        // Fetch pins
        const pinRes = await fetch(`/api/pins/${journeyId}`);
        const pinData = await pinRes.json();
        setPins(pinData.pins || []);
      } catch (err) {
        console.error('Failed to load journey or pins', err);
      }
    };
    loadJourney();
  }, [journeyId]);

  return (
    <Container
      maxWidth="xl"
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Stack spacing={3} mt={4} pb={6} sx={{ flex: 1, minHeight: 0 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 400,
            mb: 1,
            color: 'text.primary',
          }}
        >
          Welcome to the JourneyMaker
        </Typography>

        <TextareaAutosize
          value={JourneyTitle}
          onChange={(e) => setJourneyTitle(e.target.value)}
          placeholder="Enter Journey Title..."
          minRows={1}
          maxRows={1}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            overflow: 'hidden',
            resize: 'none', // prevents drag-resizing
          }}
        />

        <Box
          sx={{ display: 'flex', width: '100%', flex: 1, minHeight: 0, mt: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '60%',
              height: '100%',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <MapButtonBar
                dropPinsEnabled={dropPinsEnabled}
                onTogglePins={() => setDropPinsEnabled(!dropPinsEnabled)}
                onSaveJourney={saveJourney}
                onSearchSubmit={handleSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchBarRef={searchBarRef}
              />
            </Box>

            {searchResults.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 1000,
                  top: `${dropDownPosition.top}px`,
                  left: `${dropDownPosition.left}px`,
                  width: '45%',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  boxShadow: 3,
                  borderRadius: 1,
                }}
              >
                <Paper>
                  <List dense>
                    {searchResults.map((place, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            const lat = parseFloat(place.lat);
                            const lng = parseFloat(place.lon);
                            const bounds = place.boundingbox.map(parseFloat);
                            setCenter([lat, lng]);
                            setBounds(bounds);
                            setSearchResults([]);
                            setSearchQuery(place.display_name);
                          }}
                        >
                          <ListItemText primary={place.display_name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}

            <Box sx={{ flex: 1, mt: 3, minHeight: 0 }}>
              {/* Render map and pass in state props --> props used in map to display markers */}
              <MapComponent
                pins={pins}
                setPins={setPins}
                dropPinsEnabled={dropPinsEnabled}
                center={center}
                setCenter={setCenter}
                bounds={bounds}
                setBounds={setBounds}
                zoom={zoom}
                setZoom={setZoom}
                setActivePin={setActivePin}
                setIsPinPanelOpen={setIsPinPanelOpen}
                setIsEditMode={setIsEditMode}
              />

              <PinDetailPanel
                isPinPanelOpen={isPinPanelOpen}
                setIsPinPanelOpen={setIsPinPanelOpen}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                activePin={activePin}
                setActivePin={setActivePin}
                setPins={setPins}
                pins={pins}
              />
            </Box>
          </Box>

          <Box
            sx={{
              width: '40%',
              ml: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <TextareaAutosize
              value={JourneyDescription}
              onChange={(e) => setJourneyDescription(e.target.value)}
              placeholder="Write your journey description..."
              style={{
                height: '100%',
                width: '100%',
                resize: 'none',
                padding: '16px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
                overflow: 'auto',
              }}
            />
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
