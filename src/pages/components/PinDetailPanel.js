import {
  Drawer,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '@/utils/supabaseClient';
import { act } from 'react';

export default function PinDetailPanel({
  isPinPanelOpen,
  setIsPinPanelOpen,
  isEditMode,
  setIsEditMode,
  activePin,
  setActivePin,
  setPins,
  pins,
}) {
  const handleClose = () => {
    setIsPinPanelOpen(false);
    setIsEditMode(false);
    setActivePin(null);

    // Remove unsaved pins / if missing title and date
    // Is edit mode --> making new pin or required fields left blank
    if (isEditMode && (!activePin?.title || !activePin?.date)) {
      // remove last pin
      setPins((prev) => prev.slice(0, -1));
    }
  };

  const handleSave = async () => {
    if (!activePin.title || !activePin.date) return;

    // Handle image saving to storage
    let image_url = activePin.image_url || '';

    if (activePin.imageFile) {
      const fileExt = activePin.imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('pin-images')
        .upload(fileName, activePin.imageFile);

      if (error) {
        console.error('Upload failed:', error);
        return;
      }

      // get public URL
      const { publicURL } = supabase.storage
        .from('pin-images')
        .getPublicUrl(fileName);

      image_url = publicURL;
    }

    const updatedPin = { ...activePin, image_url };
    setPins((prev) =>
      // For each pin, check if location matches that of active pin
      // If yes, replace that pin with activePin, otherwise no change
      prev.map((pin) =>
        pin.latitude === activePin.latitude &&
        pin.longitude === activePin.longitude
          ? activePin
          : pin
      )
    );
    setIsPinPanelOpen(false);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    setPins((prev) =>
      prev.filter(
        (pin) =>
          !(
            pin.latitude === activePin.latitude &&
            pin.longitude === activePin.longitude
          )
      )
    );
    setIsPinPanelOpen(false);
    setActivePin(null);
  };

  const handleChange = (field, value) => {
    if (field === 'image') {
      const file = value;
      const previewURL = URL.createObjectURL(file);
      setActivePin((prev) => ({
        ...prev,
        imageFile: file,
      }));
    } else {
      setActivePin((prev) => ({ ...prev, [field]: value }));
    }
  };

  const sortedPins = [...pins].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentIndex = sortedPins.findIndex(
    (pin) =>
      pin.latitude === activePin?.latitude &&
      pin.longitude === activePin?.longitude
  );

  const handleNext = () => {
    if (currentIndex < sortedPins.length - 1) {
      setActivePin(sortedPins[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActivePin(sortedPins[currentIndex - 1]);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isPinPanelOpen}
      onClose={handleClose}
      // Keep above map
      sx={{ zIndex: 1301 }}
    >
      <Stack spacing={2} sx={{ width: '50vw', padding: 3 }}>
        {/* Top bar with close button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {isEditMode ? 'Edit Pin Details' : 'Pin Details'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* Editable fields */}
        {isEditMode ? (
          <>
            <TextField
              required
              label="Title"
              value={activePin?.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={activePin?.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              required
              label="Date Traveled"
              type="date"
              value={activePin?.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleChange('image', e.target.files[0]);
                  }
                }}
              />
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!activePin?.title || !activePin?.date}
            >
              Save Pin
            </Button>
          </>
        ) : (
          <>
            <Typography variant="subtitle1">
              <strong>Title:</strong> {activePin?.title}
            </Typography>
            <Typography variant="body2">
              <strong>Description:</strong> {activePin?.description || '—'}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {activePin?.date}
            </Typography>
            <Typography variant="body2">
              <strong>Image URL:</strong> {activePin?.image_url || '—'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setIsEditMode(true)}>
                Edit
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Stack>
          </>
        )}
        {!isEditMode && (
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button onClick={handlePrev} disabled={currentIndex <= 0}>
              ← Previous
            </Button>
            <Button onClick={handleNext} disabled={currentIndex >= sortedPins.length - 1}>
              Next →
            </Button>
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
}
