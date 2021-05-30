import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

const QuestRegion = (props) => {
  const classes = useStyles();

  const [viewport, setViewport] = useState({
    latitude: 39.82817,
    longitude: -98.5795,
    bearing: 0,
    pitch: 0,
    zoom: 17,
  });

  const updateCenter = (event) => {
    props.updateCenter(event);
  };

  const QuestMap = React.cloneElement(props.map, {
    latitude: props.region.latitude,
    longitude: props.region.longitude,
    bearing: props.region.bearing,
    pitch: props.region.pitch,
    zoom: props.region.zoom,
    onViewportChange: updateCenter,
  });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h4">Region</Typography>
        </Grid>
        <Grid item md={4}>
          <form noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="regionLatitude"
              label="Latitude"
              name="latitude"
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
              value={props.region.zoom}
              onChange={props.updateRegion}
            />
          </form>
        </Grid>
        <Grid item md={8}>
          {QuestMap}
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
        <Button
          variant="contained"
          color="secondary"
          onClick={props.publishQuest}
          className={classes.button}
        >
          Publish
        </Button>
      </Box>
    </>
  );
};

QuestRegion.propTypes = {
  region: PropTypes.object,
};

export default QuestRegion;
