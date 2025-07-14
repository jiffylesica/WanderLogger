import {
  Box,
  TextField,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { useRef } from 'react';

export default function MapButtonBar({
  dropPinsEnabled,
  onTogglePins,
  onSaveJourney,
  onSearchSubmit,
  searchQuery,
  setSearchQuery,
  searchBarRef,
}) {
  return (
    <Stack
      direction="row"
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
      sx={{ alignItems: 'center', height: 56 }}
    >
      <Tooltip title={dropPinsEnabled ? 'Disable Pin Drop' : 'Enable Pin Drop'}>
        <IconButton
          onClick={onTogglePins}
          sx={{
            backgroundColor: dropPinsEnabled ? '#4CAF50' : '#f44336', // bright green/red
            color: '#fff',
            '&:hover': {
              backgroundColor: dropPinsEnabled ? '#45a049' : '#d32f2f',
            },
          }}
        >
          <PlaceIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Save Journey">
        <IconButton onClick={onSaveJourney} color="secondary">
          <SaveIcon />
        </IconButton>
      </Tooltip>

      {/* Search Section */}
      <Box
        ref={searchBarRef}
        sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
      >
        <TextField
          label="Search"
          variant="filled"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Tooltip title="Search Location">
          <IconButton onClick={onSearchSubmit} sx={{ ml: 1 }}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
}
