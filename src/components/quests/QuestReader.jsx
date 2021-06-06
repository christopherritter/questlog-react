import React, { useRef, useState, useContext } from "react";
import MapGL, { Source, Layer } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloseIcon from "@material-ui/icons/Close";
import MapIcon from "@material-ui/icons/Map";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const sidebarWidth = 352;

const useStyles = makeStyles({
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  flexCenter: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&$locationSidebar": {
      left: 0,
    },
    "&$sidebarControlPanel": {
      right: 0,
    },
    "&$legendSidebar": {
      right: 0,
    },
  },
  sidebar: {
    transition: "transform 900ms",
    zIndex: 100,
    width: sidebarWidth,
    // maxHeight: "calc(100vh - 188px)",
  },
  sidebarControlPanel: {
    zIndex: 100,
    transitionDuration: "900ms",
    marginRight: -68,
    "&.collapsed": {
      transform: "translateX(-68px)",
    },
  },
  sidebarButton: {
    marginTop: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    right: 0,
    "&.MuiButton-containedSizeLarge": {
      padding: 16,
      paddingLeft: 20,
    },
    "& .MuiButton-startIcon": {
      marginRight: 0,
    },
    "& .MuiSvgIcon-root": {
      fontSize: 36,
    },
  },
  sidebarContent: {
    margin: 16,
    width: "100%",
    maxHeight: "calc(100vh - 120px)",
    // position: "absolute",
    overflowY: "auto",
  },
  locationSidebar: {
    "&.collapsed": {
      transform: "translateX(-352px)",
    },
  },
  legendSidebar: {
    "&.collapsed": {
      transform: "translateX(352px)",
    },
  },
});

const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

function QuestReader(props) {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation } =
    useContext(QuestContext);

  const [isLoaded, setLoaded] = useState(false);
  const [showLocationSidebar, setShowLocationSidebar] = useState(false);
  const [showLegendSidebar, setShowLegendSidebar] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const mapRef = useRef();
  const onLoad = () => setLoaded(true);

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

  function viewLocation(event) {
    var padding = {
      bottom: 100,
    };

    selectLocation(event);

    if (event.features[0].properties.id !== location.id) {
      padding["left"] = 300;

      setShowLocationSidebar(true);

      mapRef.current.easeTo({
        center: event.lngLat,
        bearing: event.features[0].properties.bearing,
        pitch: event.features[0].properties.pitch,
        zoom: event.features[0].properties.zoom,
        padding: padding,
        duration: 1000,
      });
    } else {
      if (showLocationSidebar) {
        padding["left"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class

        setShowLocationSidebar(false);

        mapRef.current.easeTo({
          center: event.lngLat,
          bearing: event.features[0].properties.bearing,
          pitch: event.features[0].properties.pitch,
          zoom: event.features[0].properties.zoom,
          padding: padding,
          duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
        });
      } else {
        padding["left"] = 300;

        setShowLocationSidebar(true);

        mapRef.current.easeTo({
          center: event.lngLat,
          padding: padding,
          bearing: event.features[0].properties.bearing,
          pitch: event.features[0].properties.pitch,
          zoom: event.features[0].properties.zoom,
          duration: 1000,
        });
      }
    }
  }

  function toggleLegend() {
    var padding = {
      bottom: 100,
    };
    if (showLegendSidebar) {
      padding["right"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class

      setShowLegendSidebar(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      padding["right"] = 300;

      setShowLegendSidebar(true);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    }
  }

  return (
    <Box overflow="hidden">
      {quest.region && (
        <React.Fragment>
          <MapGL
            ref={(ref) => (mapRef.current = ref && ref.getMap())}
            style={{ width: "100%", height: "calc(100vh - 64px)" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            latitude={quest.region.latitude}
            longitude={quest.region.longitude}
            bearing={quest.region.bearing}
            pitch={quest.region.pitch}
            zoom={quest.region.zoom}
            onViewportChange={updateCenter}
            onLoad={onLoad}
          >
            <Box
              id="locationSidebar"
              className={`${classes.sidebar} ${classes.flexCenter} ${
                classes.locationSidebar
              } ${showLocationSidebar ? "" : "collapsed"}`}
            >
              {location && (
                <Card className={`${classes.sidebarContent}`} elevation={5}>
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Location
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {location.name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      adjective
                    </Typography>
                    <Typography variant="body2" component="p">
                      {quest.entries &&
                        quest.entries
                          .filter((entry) => entry.locationId === location.id)
                          .map((entry) => entry.text)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              )}
            </Box>
            <Box
              id="legendSidebar"
              className={`${classes.sidebar}
              ${classes.flexCenter}
              ${classes.legendSidebar}
              ${showLegendSidebar ? "" : "collapsed"}`}
            >
              <Card className={`${classes.sidebarContent}`} elevation={5}>
                <CardContent>
                  <Grid container>
                    <Grid item sm={11}>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                      >
                        Locations
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton
                        aria-label="delete"
                        className={classes.margin}
                        onClick={toggleLegend}
                        size="small"
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <List component="nav">
                    {quest.locations &&
                      quest.locations.map((location, index) => {
                        return (
                          <ListItem
                            button
                            key={location.id}
                            selected={selectedIndex === index}
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
                </CardContent>
              </Card>
            </Box>
            <Box
              id="sidebarControlPanel"
              className={
                classes.sidebarControlPanel +
                " " +
                classes.flexCenter +
                ` ${showLegendSidebar ? "" : "collapsed"}`
              }
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                aria-label="map"
                className={classes.button + " " + classes.sidebarButton}
                startIcon={<MapIcon />}
                onClick={toggleLegend}
              />
            </Box>
            <Source id="locationsData" type="geojson" data={geojson} />
            <Layer
              source="locationsData"
              onClick={viewLocation}
              {...layerStyle}
            />
          </MapGL>
        </React.Fragment>
      )}
    </Box>
  );
}

export default QuestReader;
