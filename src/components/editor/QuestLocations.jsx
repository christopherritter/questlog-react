import React, { useState, useEffect, useRef, useContext } from "react";

import MapGL, { Source, Layer } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
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
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

function QuestLocations() {
  const classes = useStyles();
  const { quest, addLocation, setLocationIndex, findWithAttr, updateLocation, locationIndex, clearLocation, removeLocation, publishQuest } =
    useContext(QuestContext);
    const geojson = {
      type: "FeatureCollection",
      features: quest.locations
        ? quest.locations.map((location) => {
            var feature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
              },
              properties: {
                id: location.id,
                name: location.name,
                bearing: location.bearing,
                pitch: location.pitch,
                zoom: location.zoom,
                marker: location.marker,
              },
            };
            return feature;
          })
        : [],
    };
  var id = 0;

  if (quest.locations && quest.locations.length > 0) {
    var idList = quest.locations.map((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      return idNumber;
    });

    id = Math.max(...idList) + 1;
  }

  const useRefState = (initialValue) => {
    const [state, setState] = useState(initialValue);
    const stateRef = useRef(state);
    useEffect(() => {
      stateRef.current = state;
    }, [state]);
    return [state, stateRef, setState];
  };

  const initialLocationState = {
    id: "location-" + id,
    name: "",
    order: 0,
    latitude: 0,
    longitude: 0,
    bearing: quest.region.bearing,
    pitch: quest.region.pitch,
    zoom: quest.region.zoom,
    image: "",
    marker: "",
    isLandmark: false,
    isStartingPoint: false,
  };

  const [location, locationRef, setLocation] =
    useRefState(initialLocationState);

  // useEffect(() => {
  //   if (props.location) {
  //     setLocation(props.location);
  //   }
  // }, [props.location, setLocation]);

  function handleChangeLocation(event) {
    const { name, value } = event.target;
    setLocation({ ...location, [name]: value });
  };

  function handleToggleLocation(event) {
    const { name, checked } = event.target;
    setLocation({ ...location, [name]: checked });
  };

  function handleAddLocation(e) {
    e.preventDefault();
    addLocation({
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

  function handleUpdateLocation(e) {
    e.preventDefault();
    updateLocation({
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
    clearLocation();
    setLocation(initialLocationState);
    setSelectedIndex(-1);
  };

  const handleRemoveLocation = (e) => {
    e.preventDefault();
    removeLocation(location);
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
    };
    setLocation(updatedLocation);
    // setViewport(event);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // useEffect(() => {
  //   setSelectedIndex(locationIndex);
  // }, [locationIndex]);

  // const [viewport, setViewport] = useState(quest.region);

  // const mapClick = (event) => {
  //   const { lngLat } = event;
  //   const updatedLocation = {
  //     ...locationRef.current,
  //     latitude: lngLat.lat,
  //     longitude: lngLat.lng,
  //   };
  //   setLocation(updatedLocation);
  // };

  const onMapPointClick = (event) => {
    const { id } = event.features[0].properties;
    const index = findWithAttr(quest.locations, "id", id);
    setLocationIndex(index);
    setLocation(quest.locations[index]);
  };

  const renderView = (view) => {
    switch (view) {
      case "list":
        return (
          <List component="nav">
            {quest.locations &&
              quest.locations.map((location, index) => {
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
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {location.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })}
          </List>
        );
      default:
        return (<MapGL
          latitude={quest.region.latitude}
          longitude={quest.region.longitude}
          bearing={quest.region.bearing}
          pitch={quest.region.pitch}
          zoom={quest.region.zoom}
          onViewportChange={changeViewport}
          style={{ width: "100%", height: "400px" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        >
          <Source id="locationsData" type="geojson" data={geojson} />
          <Layer
            source="locationsData"
            onClick={onMapPointClick}
            {...layerStyle}
          />
        </MapGL>)
    }
  };

  const handleListItemClick = (location, index) => {
    const selectedLocation = { ...location };
    setSelectedIndex(index);
    setLocation(selectedLocation);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4} sm={12}>
          <Typography variant="h4" gutterBottom>
            Locations
          </Typography>
        </Grid>
        <Grid item md={4} sm={12}>
          <Grid container alignItems="center" justify="flex-start">
            <Grid item>
              <Button
                variant="contained"
                disableElevation
                onClick={() => {
                  clearLocation();
                  setLocation(initialLocationState);
                  setSelectedIndex(-1);
                }}
              >
                Create New
              </Button>
 
              <ToggleButtonGroup
                variant="contained"
                value={view}
                exclusive
                onChange={handleView}
                aria-label="location view"
                size="small"
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
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.root}>
        <Grid item md={4} sm={12}>
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
                  onChange={handleChangeLocation}
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
                  onChange={handleChangeLocation}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={location.isLandmark}
                      onChange={handleToggleLocation}
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
                      onChange={handleToggleLocation}
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
                  onChange={handleChangeLocation}
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
                  onChange={handleChangeLocation}
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
                  onChange={handleChangeLocation}
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
                  onChange={handleChangeLocation}
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
                  onChange={handleChangeLocation}
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
              onChange={handleChangeLocation}
            />
          </form>
        </Grid>
        <Grid item md={8} sm={12}>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              {renderView(view)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
        <Box flexGrow={1}>
          {selectedIndex === -1 ? (
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddLocation}
              className={classes.button}
            >
              Add Location
            </Button>
          ) : (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={handleUpdateLocation}
                className={classes.button}
              >
                Update
              </Button>
              <Button
                variant="contained"
                onClick={handleRemoveLocation}
                className={classes.button}
              >
                Remove
              </Button>
            </>
          )}
        </Box>
        <Box flexGrow={0}>
          <Button
            variant="contained"
            color="secondary"
            onClick={publishQuest}
            className={classes.button}
          >
            Publish
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default QuestLocations;
