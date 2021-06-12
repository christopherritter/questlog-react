import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import QuestContext from "../../contexts/QuestContext.jsx";
import MapGL, { Source, Layer } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
    marginLeft: theme.spacing(1)
  },
}));

const QuestRegion = () => {
  const classes = useStyles();
  const { quest, updateCenter, updateRegion, publishQuest } =
    useContext(QuestContext);

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
              value={quest.region.latitude}
              onChange={updateRegion}
              required
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
              type="number"
              value={quest.region.longitude}
              onChange={updateRegion}
              required
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="regionBearing"
              label="Bearing"
              name="bearing"
              type="number"
              value={quest.region.bearing}
              onChange={updateRegion}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="regionPitch"
              label="Pitch"
              name="pitch"
              type="number"
              value={quest.region.pitch}
              onChange={updateRegion}
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
              type="number"
              value={quest.region.zoom}
              onChange={updateRegion}
              InputProps={{
                readOnly: true,
              }}
            />
          </form>
        </Grid>
        <Grid item md={8}>
          <MapGL
            latitude={quest.region.latitude}
            longitude={quest.region.longitude}
            bearing={quest.region.bearing}
            pitch={quest.region.pitch}
            zoom={quest.region.zoom}
            style={{ width: "100%", height: "400px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            onViewportChange={updateCenter}
          />
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
        <Button
          variant="contained"
          color="secondary"
          onClick={publishQuest}
          className={classes.button}
        >
          Publish
        </Button>
        <Button
          variant="contained"
          color="default"
          component={RouterLink}
          to={`/quest/` + quest.questId + `/read`}
          className={classes.button}
        >
          Read
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={`/quest/` + quest.questId + `/play`}
          className={classes.button}
        >
          Play
        </Button>
      </Box>
    </>
  );
};

export default QuestRegion;
