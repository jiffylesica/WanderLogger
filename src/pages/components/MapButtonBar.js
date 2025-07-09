import { Grid, TextField, Button, Stack, Divider, Box } from "@mui/material";
import { useState } from "react";

export default function MapButtonBar({
    dropPinsEnabled,
    onTogglePins,
    onSaveJourney,
    onSearchSubmit,
    searchQuery,
    setSearchQuery
}) {
    return (
        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} sx={{alignItems: "stretch", height: 56}}>
                <Button 
                    variant={dropPinsEnabled ? "outlined" : "contained"}
                    color="primary"
                    onClick={onTogglePins}
                    sx={{width: '25%'}}
                >
                    {dropPinsEnabled ? "Disable Pin Drop" : "Enable Pin Drop"}
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onSaveJourney}
                    sx={{width: '25%'}}
                >
                    Save Journey
                </Button>

                <Box sx={{width: '50%', display: 'flex', alignItems: 'stretch'}}>

                    <TextField
                        label="Search for a Location"
                        variant="filled"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{width: '75%'}}
                    />

                    <Button
                        onClick={onSearchSubmit}
                        variant="contained"
                        sx={{width: '25%'}}
                    > 
                        Search
                    </Button>
                </Box>
        </Stack>
    )
}