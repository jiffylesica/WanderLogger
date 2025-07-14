/*
MapContainer = Main map components
TileLayer = visual tiles of map (map images)
Marker = Adds pins/markers to map
useMapEvents = Listens to map events
useState is for state in parent component
*/
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import PolylinePath from './PolylinePath';
import { Pane } from 'react-leaflet';


// Custom icon
const albatrossIcon = L.icon({
  iconUrl: '/albatross_icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -32],
});

// react component with three props
/*
1. pins = array of pins
2. setPins = function to update pins
3. droppingPinsEnabled = boolean toggle
*/
export default function MapComponent({
  pins,
  setPins,
  dropPinsEnabled,
  center,
  setCenter,
  bounds,
  setBounds,
  zoom,
  setZoom,
  setActivePin,
  setIsPinPanelOpen,
  setIsEditMode,
}) {
  // Create subcomponent within map to listen for clicks
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (dropPinsEnabled) {
          const { lat, lng } = e.latlng;
          const newPin = {
            latitude: lat,
            longitude: lng,
            title: '',
            description: '',
            date: '',
            image_url: '',
          };

          setActivePin(newPin);
          setIsPinPanelOpen(true);
          setIsEditMode(true);
          // Append newPin to previous pins
          setPins((prevPins) => [...prevPins, newPin]);
        }
      },
    });
    return null;
  }

  function RecenterMap({ bounds, setBounds }) {
    const map = useMap();
    useEffect(() => {
      if (bounds) {
        const [[south, west], [north, east]] = [
          [bounds[0], bounds[2]],
          [bounds[1], bounds[3]],
        ];
        map.fitBounds([
          [south, west],
          [north, east],
        ]);
        setBounds(null);
      }
    }, [bounds, map, setBounds]);

    return null;
  }

  function ZoomListener({ setZoom }) {
    const map = useMap();

    useEffect(() => {
      const handleZoom = () => {
        setZoom(map.getZoom());
      };

      map.on('zoomend', handleZoom);
      return () => map.off('zoomend', handleZoom);
    }, [map, setZoom]);
    return null;
  }

  function CenterListener({ setCenter }) {
    const map = useMap();

    useEffect(() => {
      const handleMove = () => {
        const center = map.getCenter();
        setCenter([center.lat, center.lng]);
      };

      map.on('moveend', handleMove);
      return () => map.off('moveend', handleMove);
    }, [map, setCenter]);

    return null;
  }

  const sortedPins = [...pins].sort((a, b) => new Date(a.date) - new Date(b.date));
  const polylinePositions = sortedPins.map(pin => [pin.latitude, pin.longitude]);

  // Actual map rendering
  return (
    
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      worldCopyJump={false}
      maxBoundsViscosity={1.0}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      zoomSnap={0.5}
    >
      <ZoomListener setZoom={setZoom} />
      <CenterListener setCenter={setCenter} />
      <RecenterMap bounds={bounds} setBounds={setBounds} />
      <MapClickHandler />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">Carto</a>'
        subdomains={['a', 'b', 'c', 'd']}
        noWrap={true}
      />
      <Pane name="polylinePane" style={{ zIndex: 399 }}>
        <PolylinePath pins={pins} />
      </Pane>
      {/* Goes through each pin, gives each marker a ID based on position in pin array,
            and position-{[pin.lat...]} places marker on the map

            Using index until pins are saved into database, where they will get permanent ID
            */}
      {pins.map((pin, index) => (
        <Marker
          key={index}
          position={[pin.latitude, pin.longitude]}
          icon={albatrossIcon}
          eventHandlers={{
            click: () => {
              setActivePin(pin);
              setIsPinPanelOpen(true);
              // Read only first when user clicks existing pin
              setIsEditMode(false);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
