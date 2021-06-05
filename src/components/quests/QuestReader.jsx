import React, { useRef, useState, useContext } from "react";
import MapGL, { Source, Layer } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

const sidebarWidth = 320;

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
    "&$left": {
      left: 0,
    },
    "&$right": {
      right: 0,
    },
  },
  sidebar: {
    transition: "transform 1s",
    zIndex: 100,
    // width: sidebarWidth,
    // maxHeight: "calc(100vh - 188px)",
  },
  sidebarContent: {
    top: 16,
    margin: 16,
    width: sidebarWidth,
    maxHeight: "calc(100vh - 120px)",
    // position: "absolute",
    fontSize: 32,
    overflowY: "auto",
  },
  left: {
    transitionDuration: "900ms",
    "&.collapsed": {
      transform: "translateX(-353px)",
    },
  },
  right: {
    transitionDuration: "900ms",
    "&.collapsed": {
      transform: "translateX(353px)",
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
    var padding = {};

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
              id="left"
              className={`${classes.sidebar} ${classes.flexCenter} ${
                classes.left
              } ${showLocationSidebar ? "" : "collapsed"}`}
            >
              {location && (
                <Card className={`${classes.sidebarContent}`}>
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Word of the Day
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
              id="right"
              className={`${classes.sidebar}
              ${classes.flexCenter}
              ${classes.right}
              ${showLegendSidebar ? "" : "collapsed"}`}
            >
              <Card className={`${classes.sidebarContent}`}>Right Sidebar</Card>
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
