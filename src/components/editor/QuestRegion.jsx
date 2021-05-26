import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const QuestRegion = (props) => {
  const onUpdateCenter = (event) => {
    props.updateCenter({
      latitude: event.latitude,
      longitude: event.longitude,
      bearing: event.bearing,
      pitch: event.pitch,
      zoom: event.zoom,
    });
  };

  const onMapClick = (event) => {
    console.log(event)
  }

  const QuestMap = React.cloneElement(props.map, {
    updateCenter: onUpdateCenter,
    onClick: onMapClick,
  });

  return (
    <Grid container spacing={4}>
      <Grid item md={4}>
        <form noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionLatitude"
            label="Latitude"
            name="latitude"
            value={props.region.latitude}
            onChange={props.updateRegion}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionLongitude"
            label="Longitude"
            name="longitude"
            value={props.region.longitude}
            onChange={props.updateRegion}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionBearing"
            label="Bearing"
            name="bearing"
            value={props.region.bearing}
            onChange={props.updateRegion}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionPitch"
            label="Pitch"
            name="pitch"
            value={props.region.pitch}
            onChange={props.updateRegion}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionZoom"
            label="Zoom"
            name="zoom"
            value={props.region.zoom}
            onChange={props.updateRegion}
          />
        </form>
      </Grid>
      <Grid item md={8}>
        { QuestMap }
      </Grid>
    </Grid>
  );
};

QuestRegion.propTypes = {
  region: PropTypes.object,
};

export default QuestRegion;
