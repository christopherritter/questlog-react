import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
import ListAltIcon from "@material-ui/icons/ListAlt";
import MapIcon from "@material-ui/icons/Map";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function QuestLocations(props) {
  const classes = useStyles();
  var id = 0;

  if (props.locations && props.locations.length > 0) {
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

  const useRefState = initialValue => {
    const [state, setState] = useState(initialValue)
    const stateRef = useRef(state)
    useEffect(
      () => { stateRef.current = state },
      [state]
    )
    return [state, stateRef, setState]
  }

  const initialLocationState = {
    id: "location-" + id,
    name: "",
    order: 0,
    latitude: 0,
    longitude: 0,
    bearing: props.region.bearing,
    pitch: props.region.pitch,
    zoom: props.region.zoom,
    image: "",
    marker: "",
    isLandmark: false,
    isStartingPoint: false,
  };

  const [location, locationRef, setLocation] = useRefState(initialLocationState);

  useEffect(() => {
    if (props.location) {
      setLocation(props.location);
    }
  }, [props.location, setLocation]);

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
    props.clearLocation();
    setLocation(initialLocationState);
    setSelectedIndex(-1);
  };

  const removeLocation = (e) => {
    e.preventDefault();
    props.removeLocation(location);
    setLocation(initialLocationState);
    setSelectedIndex(-1);
  };

  const [view, setView] = React.useState("list");

  const handleView = (event, newView) => {
    setView(newView);
  };

  const changeViewport = (event) => {
    const updatedLocation = {
      ...location,
      bearing: event.bearing,
      pitch: event.pitch,
      zoom: event.zoom,
    }
    setLocation(updatedLocation);
    setViewport(event);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useEffect(() => {
    setSelectedIndex(props.locationIndex);
  }, [props.locationIndex]);

  const [viewport, setViewport] = useState(props.region);

  const mapClick = (event) => {
    const { lngLat } = event;
    const updatedLocation = {
      ...locationRef.current,
      latitude: lngLat.lat,
      longitude: lngLat.lng
    }
    setLocation(updatedLocation);
  };

  const QuestMap = React.cloneElement(props.map, {
    latitude: viewport.latitude,
    longitude: viewport.longitude,
    bearing: viewport.bearing,
    pitch: viewport.pitch,
    zoom: viewport.zoom,
    onViewportChange: changeViewport,
    onClick: mapClick,
  });

  const renderView = (view) => {
    switch (view) {
      case "list":
        return (
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
        );
      default:
        return QuestMap;
    }
  };

  const handleListItemClick = (location, index) => {
    const selectedLocation = { ...location };
    setSelectedIndex(index);
    setLocation(selectedLocation);
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item md={4} sm={12}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Typography variant="h4" gutterBottom>
              Locations
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Button
              color="primary"
              onClick={() => {
                props.clearLocation();
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
                id="locationName"
                label="Location Name"
                name="name"
                type="text"
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
                type="number"
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
                label="Landmark"
              />
            </Grid>
            <Grid item sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={location.isStartingPoint}
                    onChange={onToggleLocation}
                    name="isStartingPoint"
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
                type="number"
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
                type="number"
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
                type="number"
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
                type="number"
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
                type="number"
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
            id="locationMarker"
            label="Marker"
            name="marker"
            type="text"
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
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleView}
              aria-label="editor view"
            >
              <ToggleButton value="list" aria-label="list view">
                <ListAltIcon />
              </ToggleButton>
              <ToggleButton value="map" aria-label="map view">
                <MapIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            {renderView(view)}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

QuestLocations.propTypes = {};

export default QuestLocations;
