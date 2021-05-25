import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function QuestLocations(props) {
  const classes = useStyles();
  var id = 0;

  if (props.locations) {
    var idList = props.locations.map((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      return idNumber;
    });

    id = Math.max(...idList) + 1;
  }

  const initialLocationState = {
    id: "location-" + id,
    name: "",
    latitude: 0,
    longitude: 0,
    bearing: 0,
    pitch: 0,
    zoom: 0,
    image: "",
    marker: "",
    order: 0,
    isLandmark: false,
    isStartingPoint: false,
  };
  const [location, setLocation] = useState(initialLocationState);

  const onChangeLocation = (event) => {
    const { name, value } = event.target;
    setLocation({ ...location, [name]: value });
  };
  const onToggleLocation = (event) => {
    const { name, checked } = event.target;
    setLocation({ ...location, [name]: checked });
  };

  const addLocation = (e) => {
    e.preventDefault();
    props.addLocation({
      id: "location-" + id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      bearing: location.bearing,
      pitch: location.pitch,
      zoom: location.zoom,
      image: location.image,
      marker: location.marker,
      order: location.order,
      isLandmark: location.isLandmark,
      isStartingPoint: location.isStartingPoint,
    });
    setLocation(initialLocationState);
    setSelectedIndex(-1);
  };

  const updateLocation = (e) => {
    e.preventDefault();
    props.updateLocation({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      bearing: location.bearing,
      pitch: location.pitch,
      zoom: location.zoom,
      image: location.image,
      marker: location.marker,
      order: location.order,
      isLandmark: location.isLandmark,
      isStartingPoint: location.isStartingPoint,
    });
    setLocation(initialLocationState);
    setSelectedIndex(-1);
  };

  const removeLocation = (e) => {
    e.preventDefault();
    props.removeLocation(location);
    setLocation(initialLocationState);
    setSelectedIndex(-1);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleListItemClick = (location, index) => {
    const selectedLocation = {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      bearing: location.bearing,
      pitch: location.pitch,
      zoom: location.zoom,
      image: location.image,
      marker: location.marker,
      order: location.order,
      isLandmark: location.isLandmark,
      isStartingPoint: location.isStartingPoint,
    };
    setSelectedIndex(index);
    setLocation(selectedLocation);
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item md={4} sm={12}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <h2>Locations</h2>
          </Grid>
          <Grid item md={4}>
            <Button
              color="primary"
              onClick={() => {
                setLocation(initialLocationState);
                setSelectedIndex(-1);
              }}
            >
              Create New
            </Button>
          </Grid>
        </Grid>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item sm={8}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationText"
                label="Location Name"
                name="name"
                value={location.name}
                onChange={onChangeLocation}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationOrder"
                label="Order"
                name="order"
                value={location.order}
                onChange={onChangeLocation}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={location.isLandmark}
                    onChange={onToggleLocation}
                    name="isLandmark"
                  />
                }
                label="Primary Location"
              />
            </Grid>
            <Grid item sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={location.isStartingPoint}
                    onChange={onToggleLocation}
                    name="isStartingPoing"
                  />
                }
                label="Starting Point"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationLatitude"
                label="Latitude"
                name="latitude"
                value={location.latitude}
                onChange={onChangeLocation}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationLongitude"
                label="Longitude"
                name="longitude"
                value={location.longitude}
                onChange={onChangeLocation}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item sm={4}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationBearing"
                label="Bearing"
                name="bearing"
                value={location.bearing}
                onChange={onChangeLocation}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationPitch"
                label="Pitch"
                name="pitch"
                value={location.pitch}
                onChange={onChangeLocation}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="locationZoom"
                label="Zoom"
                name="zoom"
                value={location.zoom}
                onChange={onChangeLocation}
              />
            </Grid>
          </Grid>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="locationImage"
            label="Image"
            name="image"
            value={location.image}
            onChange={onChangeLocation}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="locationMarker"
            label="Marker"
            name="marker"
            value={location.marker}
            onChange={onChangeLocation}
          />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectedIndex === -1 ? (
                <Button color="primary" onClick={addLocation}>
                  Add Location
                </Button>
              ) : (
                <>
                  <Button color="primary" onClick={updateLocation}>
                    Update
                  </Button>
                  <Button color="primary" onClick={removeLocation}>
                    Remove
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item md={8} sm={12}>
        <List component="nav">
          {props.locations &&
            props.locations.map((location, index) => {
              return (
                <ListItem
                  button
                  key={location.id}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(location, index)}
                >
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary={location.name} />
                </ListItem>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
}

QuestLocations.propTypes = {};

export default QuestLocations;
