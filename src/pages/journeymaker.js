// useState lets component remember values between renders
import { useState } from "react";
// Have to wait to load map component on window bc leaflet renders on window
import dynamic from "next/dynamic";
import { Container, Typography, Button, TextField, Stack, Box, Grid, Paper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MapButtonBar from "./components/MapButtonBar";
import PinDetailPanel from "./components/PinDetailPanel";


// This basically says don't try to load the map component on the server side, wait until on browser
const MapComponent = dynamic(() => import('./components/MapComponent'), {
    ssr: false
})

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
    const [JourneyTitle, setJourneyTitle] = useState("");
    const [JourneyDescription, setJourneyDescription] = useState("");

    // Add centering to move map to selected location
    const [center, setCenter] = useState([0,0]);
    const [bounds, setBounds] = useState(null);

    // Add zoom state to prevent map rezooming
    const [zoom, setZoom] = useState(2)

    // Search bar states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Pin states for active pins
    const [activePin, setActivePin] = useState(null);
    const [isPinPanelOpen, setIsPinPanelOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);


    const saveJourney = async () => {
        try {
            const journeyResponse = await fetch('api/journeys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1,
                    journey_title: JourneyTitle,
                    journey_description: JourneyDescription
                })
            });

        const journeyData = await journeyResponse.json();
        // Get id returned by json response
        const journeyId = journeyData.journey.id;

        // Save each pin associated with journey
        for (const pin of pins) {
            const pinResponse = await fetch('api/pins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    journey_id: journeyId,
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
            console.log('Journey Created:', journeyData.journey)
        } else {
            console.error('Error creating journey:', journeyData.error)
        }

        } catch (err) {
            console.error('Network Error:', err)
        }
    };

    const handleSearch = async (e) => {
        console.log("Search button clicked with query:", searchQuery);
        // response based on users typed query
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("API response:", data);
        // Retrieve search reslts and store them in results
        setSearchResults(data);
    };

    return (
        <Container maxWidth="xl">
            <Stack spacing={3} mt={4} pb={6}>
                <Typography>Create Your Journey</Typography>

                {/* Button that toggles pin drop mode */}

                <TextField
                    label="Journey Name"
                    value={JourneyTitle}
                    onChange={(e) => setJourneyTitle(e.target.value)}
                    fullWidth
                />

                <Box sx={{position: "relative", width: "100%"}}>
                    
                    <MapButtonBar
                        dropPinsEnabled={dropPinsEnabled}
                        onTogglePins={() => setDropPinsEnabled(!dropPinsEnabled)}
                        onSaveJourney={saveJourney}
                        onSearchSubmit={handleSearch}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    {searchResults.length > 0 && (
                        <Box sx={{mt: 2}}>
                            <Paper>
                                <List>
                                    {searchResults.map((place, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton
                                                onClick={() => {
                                                    const lat = parseFloat(place.lat);
                                                    const lng = parseFloat(place.lon);
                                                    const bounds = place.boundingbox.map(parseFloat)
                                                    setCenter([lat, lng]);
                                                    setBounds(bounds);
                                                    setSearchResults([]);
                                                    setSearchQuery(place.display_name)
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

                    <Box sx={{ width: "100%", mt: 3}} >
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
                        />
                    </Box>

                </Box>

                <TextField
                    label="Journey Description"
                    value={JourneyDescription}
                    onChange={(e) => setJourneyDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                />

            </Stack>
        </Container>
    );
}