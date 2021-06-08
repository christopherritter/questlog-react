import React, { useRef, useState, useContext } from "react";
import MapGL, { Source, Marker } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";
import QuestSidebar from "./QuestSidebar.jsx";
import QuestLegend from "./QuestLegend.jsx";
import QuestJournal from "./QuestJournal.jsx";
import QuestBackpack from "./QuestBackpack.jsx";

import { makeStyles } from "@material-ui/core/styles";
import { green, pink } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import MapIcon from "mdi-material-ui/Map";
import NotebookIcon from "mdi-material-ui/Notebook";
import BackpackIcon from "mdi-material-ui/BagPersonal";
import MapMarkerIcon from "mdi-material-ui/MapMarker";

const sidebarWidth = 352;

const useStyles = makeStyles((theme) => ({
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: "#fff",
    backgroundColor: green[500],
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
    "&$journalSidebar": {
      right: 0,
    },
    "&$backpackSidebar": {
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
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    right: 0,
    marginRight: -68,
    transitionDuration: "900ms",
    "&.collapsed": {
      transform: "translateX(-68px)",
    },
  },
  sidebarButton: {
    marginTop: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,

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
  journalSidebar: {
    "&.collapsed": {
      transform: "translateX(352px)",
    },
  },
  backpackSidebar: {
    "&.collapsed": {
      transform: "translateX(352px)",
    },
  },
}));

// const layerStyle = {
//   id: "point",
//   type: "symbol",
//   layout: {
//     "text-field": ["get", "name"],
//     "text-variable-anchor": ["top", "bottom", "left", "right"],
//     "text-radial-offset": 1.25,
//     "text-justify": "auto",
//     "icon-image": ["get", "marker"],
//   },
// };

function QuestReader(props) {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation } =
    useContext(QuestContext);

  const [isLoaded, setLoaded] = useState(false);
  const [showLocationSidebar, setShowLocationSidebar] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const mapRef = useRef();
  const onLoad = () => setLoaded(true);

  // const geojson = {
  //   type: "FeatureCollection",
  //   features: quest.locations
  //     ? quest.locations.map((location) => {
  //         var feature = {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [location.longitude, location.latitude],
  //           },
  //           properties: {
  //             id: location.id,
  //             name: location.name,
  //             bearing: location.bearing,
  //             pitch: location.pitch,
  //             zoom: location.zoom,
  //             marker: location.marker,
  //           },
  //         };
  //         return feature;
  //       })
  //     : [],
  // };

  // const viewLocation = (event) => {
  //   console.log(event)
  //   event.stopPropagation();
  // }

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
    if (showLegend) {
      padding["right"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class

      setShowLegend(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      padding["right"] = 300;

      setShowLegend(true);

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
        center: [item.longitude, item.latitude],
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
          center: [item.longitude, item.latitude],
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
          center: [item.longitude, item.latitude],
          padding: padding,
          bearing: item.bearing,
          pitch: item.pitch,
          zoom: item.zoom,
          duration: 1000,
        });
      }
    }
  }

  function toggleJournal() {
    var padding = {
      bottom: 50,
    };
    if (showJournal) {
      padding["right"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class

      setShowJournal(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      padding["right"] = 300;

      setShowJournal(true);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    }
  }

  function selectJournalItem() {
    console.log("Select journal item");
  }

  function toggleBackpack() {
    var padding = {
      bottom: 50,
    };
    if (showBackpack) {
      padding["right"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class

      setShowBackpack(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      padding["right"] = 300;

      setShowBackpack(true);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    }
  }

  function selectBackpackItem() {
    console.log("Select backpack item");
  }

  const QuestMarker = (props) => {
    const { id, longitude, latitude, bearing, pitch, zoom } = props;

    const onMarkerClick = () => {
      const locationId = {
        lngLat: {
          lng: longitude,
          lat: latitude,
        },
        features: [
          {
            properties: {
              id,
              bearing,
              pitch,
              zoom,
            },
          },
        ],
      };
      viewLocation(locationId);
    };

    return <Marker onClick={onMarkerClick} {...props} />;
  };

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
              {location && <QuestSidebar width={sidebarWidth} />}
            </Box>
            <Box
              id="legendSidebar"
              className={`${classes.sidebar}
              ${classes.flexCenter}
              ${classes.legendSidebar}
              ${showLegend ? "" : "collapsed"}`}
            >
              <QuestLegend
                width={sidebarWidth}
                toggleLegend={toggleLegend}
                selectLegendItem={selectLegendItem}
              />
            </Box>
            <Box
              id="journalSidebar"
              className={`${classes.sidebar}
              ${classes.flexCenter}
              ${classes.journalSidebar}
              ${showJournal ? "" : "collapsed"}`}
            >
              <QuestJournal
                width={sidebarWidth}
                toggleJournal={toggleJournal}
                selectJournalItem={selectJournalItem}
              />
            </Box>
            <Box
              id="backpackSidebar"
              className={`${classes.sidebar}
              ${classes.flexCenter}
              ${classes.backpackSidebar}
              ${showBackpack ? "" : "collapsed"}`}
            >
              <QuestBackpack
                width={sidebarWidth}
                toggleBackpack={toggleBackpack}
                selectBackpackItem={selectBackpackItem}
              />
            </Box>
            <Box
              id="sidebarControlPanel"
              className={
                classes.sidebarControlPanel +
                " " +
                classes.flexCenter +
                ` ${
                  showLegend || showJournal || showBackpack ? "" : "collapsed"
                }`
              }
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                aria-label="Legend"
                className={classes.sidebarButton}
                startIcon={<MapIcon />}
                onClick={toggleLegend}
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                aria-label="Journal"
                className={classes.sidebarButton}
                startIcon={<NotebookIcon />}
                onClick={toggleJournal}
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                aria-label="Backpack"
                className={classes.sidebarButton}
                startIcon={<BackpackIcon />}
                onClick={toggleBackpack}
              />
            </Box>
            {/* <Source id="locationsData" type="geojson" data={geojson} /> */}
            {/* <Layer
              source="locationsData"
              onClick={viewLocation}
              {...layerStyle}
            /> */}
            {quest.locations.map((location, index) => (
              <QuestMarker
                id={location.id}
                longitude={location.longitude}
                latitude={location.latitude}
                bearing={location.bearing}
                pitch={location.pitch}
                zoom={location.zoom}
                key={index}
              >
                <Avatar className={classes.pink}>
                  <MapMarkerIcon />
                </Avatar>
              </QuestMarker>
            ))}
          </MapGL>
        </React.Fragment>
      )}
    </Box>
  );
}

export default QuestReader;
