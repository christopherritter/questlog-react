import React, { useRef, useState, useContext } from "react";
import MapGL, { Source, Layer } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";
import QuestSidebar from "./QuestSidebar.jsx";
import QuestLegend from "./QuestLegend.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import MapIcon from "@material-ui/icons/Map";

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
      bottom: 50,
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
      bottom: 50,
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
  
  function selectLegendItem(item) {
    const formattedLocation = {
      features: [
        {
          properties: {
            id: item.id,
          },
        },
      ],
    };
    var padding = {
      bottom: 50,
    };
  
    selectLocation(formattedLocation);
  
    if (item.id !== location.id) {
      padding["left"] = 300;
  
      setShowLocationSidebar(true);
  
      mapRef.current.easeTo({
        center: [ item.longitude, item.latitude ],
        bearing: item.bearing,
        pitch: item.pitch,
        zoom: item.zoom,
        padding: padding,
        duration: 1000,
      });
    } else {
      if (showLocationSidebar) {
        padding["left"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class
  
        setShowLocationSidebar(false);
  
        mapRef.current.easeTo({
          center: [ item.longitude, item.latitude ],
          bearing: item.bearing,
          pitch: item.pitch,
          zoom: item.zoom,
          padding: padding,
          duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
        });
      } else {
        padding["left"] = 300;
  
        setShowLocationSidebar(true);
  
        mapRef.current.easeTo({
          center: [ item.longitude, item.latitude ],
          padding: padding,
          bearing: item.bearing,
          pitch: item.pitch,
          zoom: item.zoom,
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
              id="locationSidebar"
              className={`${classes.sidebar} ${classes.flexCenter} ${
                classes.locationSidebar
              } ${showLocationSidebar ? "" : "collapsed"}`}
            >
              {location && (
                <QuestSidebar width={sidebarWidth} />
              )}
            </Box>
            <Box
              id="legendSidebar"
              className={`${classes.sidebar}
              ${classes.flexCenter}
              ${classes.legendSidebar}
              ${showLegendSidebar ? "" : "collapsed"}`}
            >
              <QuestLegend width={sidebarWidth} toggleLegend={toggleLegend} selectedIndex={selectedIndex} selectLegendItem={selectLegendItem} />
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
