import React, { useState, useEffect, useRef, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";
import QuestMapMarker from "../quests/QuestMapMarker.jsx";

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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Avatar from "@material-ui/core/Avatar";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import { grey } from "@material-ui/core/colors";
import ListAltIcon from "mdi-material-ui/FormatListBulleted";
import MapIcon from "mdi-material-ui/Map";

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
    marginRight: theme.spacing(1),
  },
  topRowButton: {
    marginRight: theme.spacing(1),
    height: "2.90em",
  },
  formControl: {
    marginTop: theme.spacing(2),
  },
  viewHandler: {
    verticalAlign: "middle",
  },
  avatar: {
    color: "#fff",
    backgroundColor: grey[800],
  },
}));

function QuestLocations() {
  const classes = useStyles();
  const {
    quest,
    addLocation,
    findWithAttr,
    updateLocation,
    clearLocation,
    removeLocation,
    publishQuest,
    markerTypes,
  } = useContext(QuestContext);

  var id = 0, idList = [0];

  if (quest.locations && quest.locations.length > 0) {
    quest.locations.forEach((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      idList.push(idNumber);
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
  };

  const [location, locationRef, setLocation] =
    useRefState(initialLocationState);


  const currentLocations = [...quest.locations];
  const orderedLocations = currentLocations.sort((a, b) =>
    a.order > b.order ? 1 : -1
  );

  function handleChangeLocation(event) {
    const { name, value } = event.target;
    setLocation({ ...location, [name]: value });
  }

  function handleToggleLocation(event) {
    const { name, checked } = event.target;
    setLocation({ ...location, [name]: checked });
  }

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
    });
    setLocation(initialLocationState);
    updateSelectedIndex(-1);
  }

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
    });
    clearLocation();
    setLocation(initialLocationState);
    updateSelectedIndex(-1);
  }

  const handleRemoveLocation = (e) => {
    e.preventDefault();
    removeLocation(location);
    setLocation(initialLocationState);
    updateSelectedIndex(-1);
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
  const updateSelectedIndex = (index) => {
    setSelectedIndex(index);
  }

  // useEffect((event) => {
  //   console.log("selected index effect")
  //   console.log(selectedIndex)

  // }, [selectedIndex]);


  // useEffect(() => {
  //   updateSelectedIndex(locationIndex);
  // }, [locationIndex]);

  // const [viewport, setViewport] = useState(quest.region);

  const handleMapClick = (event) => {
    const { lngLat } = event;
    const updatedLocation = {
      ...locationRef.current,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };
    if (selectedIndex === -1 ) {
      setLocation(updatedLocation);
    }
  };

  const handleViewLocation = (locationId) => {
    const index = findWithAttr(quest.locations, "id", locationId);
    const selectedLocation = { ...quest.locations[index] };
    updateSelectedIndex(index);
    setLocation(selectedLocation);
  };

  const renderView = (view) => {
    switch (view) {
      case "list":
        return (
          <List component="nav">
            {quest.locations &&
              orderedLocations.map((location, index) => {
                return (
                  <ListItem
                    button
                    key={location.id}
                    selected={selectedIndex === index}
                    onClick={() => handleListItemClick(location, index)}
                  >
                    <ListItemIcon>
                      <Avatar className={classes.avatar}>{ location.order }</Avatar>
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
        return (
          <MapGL
            latitude={quest.region.latitude}
            longitude={quest.region.longitude}
            bearing={quest.region.bearing}
            pitch={quest.region.pitch}
            zoom={quest.region.zoom}
            onViewportChange={changeViewport}
            style={{ width: "100%", height: "400px" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            onClick={handleMapClick}
          >
            {quest.locations.map((el, index) => (
              <QuestMapMarker
                location={el}
                key={index}
                viewLocation={(loc) => handleViewLocation(loc)}
              ></QuestMapMarker>
            ))}
          </MapGL>
        );
    }
  };

  const handleListItemClick = (location, index) => {
    const selectedLocation = { ...location };
    updateSelectedIndex(index);
    setLocation(selectedLocation);
  };

  function handleSelectMarker(event) {
    const { name, value } = event.target;
    setLocation({ ...location, [name]: value });
  }

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
                variant="outlined"
                disableElevation
                className={classes.topRowButton}
                onClick={() => {
                  clearLocation();
                  setLocation(initialLocationState);
                  updateSelectedIndex(-1);
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
                className={classes.viewHandler}
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
              <Grid item sm={12}>
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
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel htmlFor="locationMarker">Marker</InputLabel>
              <Select
                native
                value={location.marker}
                onChange={handleSelectMarker}
                inputProps={{
                  name: "marker",
                  id: "locationMarker",
                }}
              >
                <option value={undefined}></option>
                {markerTypes &&
                  markerTypes.map((marker, index) => {
                    return (
                      <option value={marker.value} key={index}>
                        {marker.name}
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
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
      </Box>
    </>
  );
}

export default QuestLocations;
