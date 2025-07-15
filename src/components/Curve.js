// src/components/Curve.js
import { createLayerComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet-curve';  // make sure the plugin is loaded

// 1) Create function
function createCurve({ positions, pathOptions, pane }, context) {
  const layer = L.curve(positions, pathOptions);
  return { instance: layer, context: { ...context, pane } };
}

// 2) Update function
function updateCurve(layer, props, prevProps) {
  // Update the path if positions changed
  if (props.positions && props.positions !== prevProps.positions) {
    layer.setPath(props.positions);
  }

  // Merge new style options and redraw
  if (props.pathOptions && props.pathOptions !== prevProps.pathOptions) {
    Object.assign(layer.options, props.pathOptions);
    layer.redraw();
  }
}

export const Curve = createLayerComponent(
  createCurve,
  updateCurve
);
