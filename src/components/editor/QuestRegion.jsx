import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const QuestRegion = (props) => {
  const onUpdateCenter = (event) => {
    props.updateCenter({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  };

  const QuestMap = React.cloneElement(props.map, {
    updateCenter: onUpdateCenter,
  });

  return (
    <Grid container spacing={4}>
      <Grid item sm={3}>
        <form noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionName"
            label="Name"
            name="name"
            value={props.region.name}
            onChange={props.updateRegion}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="regionLatitude"
            label="Latitude"
            name="latitude"
            value={props.region.latitude}
            onChange={props.updateRegion}
            InputProps={{
              readOnly: true,
            }}
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
            InputProps={{
              readOnly: true,
            }}
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
      <Grid item sm={9}>
        {QuestMap}
      </Grid>
    </Grid>
  );
};

QuestRegion.propTypes = {
  region: PropTypes.object,
};

export default QuestRegion;
