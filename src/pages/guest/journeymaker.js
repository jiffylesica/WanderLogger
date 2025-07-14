import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Container,
  Typography,
  TextareaAutosize,
  Stack,
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MapButtonBar from '../components/MapButtonBar';
import PinDetailPanel from '../components/PinDetailPanel';
import { useRouter } from 'next/router';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

export default function GuestJourneyMaker() {
    const router = useRouter();
  const [pins, setPins] = useState([]);
  const [dropPinsEnabled, setDropPinsEnabled] = useState(false);
  const [JourneyTitle, setJourneyTitle] = useState('');
  const [JourneyDescription, setJourneyDescription] = useState('');
  const [center, setCenter] = useState([0, 0]);
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activePin, setActivePin] = useState(null);
  const [isPinPanelOpen, setIsPinPanelOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const searchBarRef = useRef(null);
  const [dropDownPosition, setDropDownPosition] = useState({ top: 0, left: 0 });

  const handleSearch = async () => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
    );
    const data = await res.json();
    setSearchResults(data);

    if (searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect();
      setDropDownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
    }
  };

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

  const saveJourney = () => {
    const newJourney = {
        title: JourneyTitle,
        description: JourneyDescription,
        pins,
    };

    const stored = localStorage.getItem('guestJourneys');
    const allJourneys = stored ? JSON.parse(stored) : [];

    allJourneys.push(newJourney);
    localStorage.setItem('guestJourneys', JSON.stringify(allJourneys));

    alert('Mock journey saved locally!');
    router.push('/guest');
    };


  return (
    <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={3} mt={4} pb={6} sx={{ flex: 1, minHeight: 0 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 400, mb: 1 }}>
          Welcome to the Guest JourneyMaker
        </Typography>

        <TextareaAutosize
          value={JourneyTitle}
          onChange={(e) => setJourneyTitle(e.target.value)}
          placeholder="Enter Journey Title..."
          minRows={1}
          maxRows={1}
          style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <Box sx={{ display: 'flex', width: '100%', flex: 1, minHeight: 0, mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', height: '100%' }}>
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
              <Box sx={{ position: 'absolute', zIndex: 1000, top: `${dropDownPosition.top}px`, left: `${dropDownPosition.left}px`, width: '45%', maxHeight: '240px', overflowY: 'auto', boxShadow: 3, borderRadius: 1 }}>
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

          <Box sx={{ width: '40%', ml: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TextareaAutosize
              value={JourneyDescription}
              onChange={(e) => setJourneyDescription(e.target.value)}
              placeholder="Write your journey description..."
              style={{ height: '100%', width: '100%', resize: 'none', padding: '16px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', overflow: 'auto' }}
            />
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}