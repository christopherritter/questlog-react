import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import MapGL, { GeolocateControl, Popup } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import bbox from "@turf/bbox";
import distance from "@turf/distance";
import { point, multiPoint } from "@turf/helpers";

import QuestContext from "../../contexts/QuestContext.jsx";
import QuestSidebar from "./QuestSidebar.jsx";
import QuestLegend from "./QuestLegend.jsx";
import QuestJournal from "./QuestJournal.jsx";
import QuestBackpack from "./QuestBackpack.jsx";
import QuestMapMarker from "./QuestMapMarker.jsx";
import QuestDialog from "./QuestDialog.jsx";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { green, pink } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import MapIcon from "mdi-material-ui/Map";
import NotebookIcon from "mdi-material-ui/Notebook";
import BackpackIcon from "mdi-material-ui/BagPersonal";

const mapHeight = 175;
const sidebarWidth = 352;
const actionBarHeight = 104;

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
  questMap: {
    width: "100%",
    height: "calc(100vh - 64px)",
    [theme.breakpoints.down("sm")]: {
      height: `calc(100vh - 64px - ${actionBarHeight}px )`,
    },
  },
  sidebar: {
    transition: "transform 900ms",
    zIndex: 100,
    width: sidebarWidth,
    // maxHeight: "calc(100vh - 188px)",
    padding: 16,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: mapHeight,
      padding: 0,
    },
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
    [theme.breakpoints.down("sm")]: {
      display: "none",
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
  locationSidebar: {
    [theme.breakpoints.up("md")]: {
      "&.collapsed": {
        transform: "translateX(-352px)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "&.collapsed": {
        transform: "translateY(calc(100vh - 120px))",
      },
    },
  },
  legendSidebar: {
    [theme.breakpoints.up("md")]: {
      "&.collapsed": {
        transform: "translateX(352px)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "&.collapsed": {
        transform: "translateY(calc(100vh - 120px))",
      },
    },
  },
  journalSidebar: {
    [theme.breakpoints.up("md")]: {
      "&.collapsed": {
        transform: "translateX(352px)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "&.collapsed": {
        transform: "translateY(calc(100vh - 120px))",
      },
    },
  },
  backpackSidebar: {
    [theme.breakpoints.up("md")]: {
      "&.collapsed": {
        transform: "translateX(352px)",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "&.collapsed": {
        transform: "translateY(calc(100vh - 120px))",
      },
    },
  },
  actionBar: {
    marginTop: 24,
    marginBottom: 24,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  actionBarIcon: {
    fontSize: "3em",
  },
}));

function QuestPlayer(props) {
  const theme = useTheme();
  const classes = useStyles(props);
  const {
    quest,
    location,
    item,
    setQuest,
    updateCenter,
    selectLocation,
    viewQuestItem,
    operateQuestItem,
    findWithAttr,
  } = useContext(QuestContext);
  const isMediumAndUp = useMediaQuery(theme.breakpoints.up("md"));

  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const [isLoaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLocationSidebar, setShowLocationSidebar] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogType, setDialogType] = React.useState();
  const [position, setPosition] = React.useState(null);

  const mapRef = useRef();
  const geolocateRef = useRef();
  const popupRef = useRef();
  const locationRef = useRef();
  const positionRef = useRef();
  const sidebarRef = useRef({
    location: false,
    legend: false,
    journal: false,
    backpack: false,
  });

  const bottomOffset = size.y - 64 - actionBarHeight - mapHeight;

  const previewLocation = useCallback(
    (loc) => {
      var from = [positionRef.current.longitude, positionRef.current.latitude];
      var to = [loc.longitude, loc.latitude];
      var coords = [from, to];
      var multiPt = multiPoint(coords);
      var bounds = bbox(multiPt);
      var padding = {};

      if (isMediumAndUp) {
        padding = { left: 200, right: 200, top: 50, bottom: 50 };
      } else {
        padding = { left: 75, right: 100, top: 50, bottom: 50 };
      }

      setShowLocationSidebar(false);
      selectLocation(loc.id);

      mapRef.current.fitBounds(bounds, {
        padding: padding,
      });
    },
    [isMediumAndUp, selectLocation, positionRef]
  );

  const viewStartingPoint = useCallback(() => {
    const currentLocations = [...quest.locations];
    const sortedLocations = currentLocations.sort((a, b) =>
      a.order > b.order ? 1 : -1
    );
    var padding = {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    };

    if (position.latitude && position.longitude) {
      var from = point([position.longitude, position.latitude]);
      var to = point([
        sortedLocations[0].longitude,
        sortedLocations[0].latitude,
      ]);
      var options = { units: "miles" };
      var totalDistance = distance(from, to, options);
      var totalDistanceInYards = Math.round(totalDistance * 1760);

      if (totalDistanceInYards < 100) {
        if (isMediumAndUp) {
          padding["left"] = 300;
        } else {
          padding["bottom"] = bottomOffset;
        }

        selectLocation(sortedLocations[0].id);
        setShowLocationSidebar(true);

        mapRef.current.easeTo({
          center: {
            lat: sortedLocations[0].latitude,
            lng: sortedLocations[0].longitude,
          },
          bearing: sortedLocations[0].bearing,
          pitch: sortedLocations[0].pitch,
          zoom: sortedLocations[0].zoom,
          padding: padding,
          duration: 1000,
        });
      } else {
        previewLocation(sortedLocations[0]);
      }
    }
  }, [
    quest,
    position,
    previewLocation,
    selectLocation,
    bottomOffset,
    isMediumAndUp,
  ]);

  const showLocation = useCallback(
    (loc) => {
      var padding = {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      };

      if (sidebarRef.current.location && sidebarRef.current.legend) {
        if (isMediumAndUp) {
          padding["left"] = 0;
          padding["right"] = 300;
        } else {
          padding["bottom"] = bottomOffset;
        }
      } else if (sidebarRef.current.location && !sidebarRef.current.legend) {
        if (isMediumAndUp) {
          padding["left"] = 300;
          padding["right"] = 0;
        } else {
          padding["bottom"] = bottomOffset;
        }
      } else if (!sidebarRef.current.location && sidebarRef.current.legend) {
        if (isMediumAndUp) {
          padding["left"] = 300;
          padding["right"] = 300;
        } else {
          padding["bottom"] = bottomOffset;
        }
      } else {
        if (isMediumAndUp) {
          padding["left"] = 0;
          padding["right"] = 0;
        } else {
          padding["bottom"] = 0;
        }
      }

      selectLocation(loc.id);

      mapRef.current.easeTo({
        center: {
          lat: loc.latitude,
          lng: loc.longitude,
        },
        bearing: loc.bearing,
        pitch: loc.pitch,
        zoom: loc.zoom,
        padding: padding,
        duration: 1000,
      });
    },
    [selectLocation, isMediumAndUp, bottomOffset]
  );

  useEffect(() => (window.onresize = updateSize), []);

  useEffect(() => {
    var questComplete = true;

    if (quest.objectives && quest.objectives.length > 0) {
      quest.objectives
        .filter((objective) => objective.isPrimary === true)
        .forEach((objective) => {
          if (objective.isComplete === false) questComplete = false;
        });

      if (questComplete) {
        handleUpdateDialogType("complete");
        setOpenDialog(true);
      } else {
        setOpenDialog(false);
      }
    } else {
      setOpenDialog(false);
    }
  }, [quest.objectives]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (position) {
      if (!isPlaying) {
        viewStartingPoint();
        setIsPlaying(true);
      }
    }
  }, [position, isPlaying, viewStartingPoint]);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    sidebarRef.current["location"] = showLocationSidebar;
    sidebarRef.current["legend"] = showLegend;
    sidebarRef.current["journal"] = showJournal;
    sidebarRef.current["backpack"] = showBackpack;
  }, [showLocationSidebar, showLegend, showJournal, showBackpack]);

  function updateSize() {
    setSize({
      x: window.innerWidth,
      y: window.innerHeight,
    });
  }

  function handleClose() {
    setOpenDialog(false);
  }

  function onLoad() {
    handleUpdateDialogType("begin");
    setLoaded(true);
    setOpenDialog(true);
    if (geolocateRef.current) {
      geolocateRef.current.options.showAccuracyCircle = false;
    }
    if (popupRef.current) {
      popupRef.current.options.dynamicPosition = false;
    }
  }

  function handleBeginQuest() {
    if (geolocateRef.current) {
      geolocateRef.current.trigger();
    }
    setOpenDialog(false);
  }

  function toggleLegend() {
    var padding = {};
    if (showLegend) {
      if (isMediumAndUp) {
        padding["right"] = 0;
      } else {
        padding["bottom"] = 0;
      }

      setShowLegend(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      if (isMediumAndUp) {
        padding["right"] = 300;
      } else {
        padding["bottom"] = bottomOffset;
      }

      setShowLegend(true);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    }
  }

  function toggleJournal() {
    var padding = {};
    if (showJournal) {
      if (isMediumAndUp) {
        padding["right"] = 0;
      } else {
        padding["bottom"] = 0;
      }

      setShowJournal(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      if (isMediumAndUp) {
        padding["right"] = 300;
      } else {
        padding["bottom"] = bottomOffset;
      }

      setShowJournal(true);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    }
  }

  function handleSelectJournalItem() {
    setOpenDialog(true);
  }

  function toggleBackpack() {
    var padding = {};
    if (showBackpack) {
      if (isMediumAndUp) {
        padding["right"] = 0;
      } else {
        padding["bottom"] = 0;
      }

      setShowBackpack(false);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
      });
    } else {
      if (isMediumAndUp) {
        padding["right"] = 300;
      } else {
        padding["bottom"] = bottomOffset;
      }

      setShowBackpack(true);

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    }
  }

  function handleSelectBackpackItem(item) {
    viewQuestItem(item);
    handleUpdateDialogType("item");
    setOpenDialog(true);
  }

  function handleViewLocation(id) {
    const selectedLocationIndex = findWithAttr(quest.locations, "id", id);
    const selectedLocation = quest.locations[selectedLocationIndex];

    if (positionRef.current) {
      var from = point([
        positionRef.current.longitude,
        positionRef.current.latitude,
      ]);
      var to = point([selectedLocation.longitude, selectedLocation.latitude]);
      var options = { units: "miles" };
      var totalDistance = distance(from, to, options);
      var totalDistanceInYards = Math.round(totalDistance * 1760);

      if (totalDistanceInYards < 100) {
        if (locationRef.current.id === id) {
          toggleSidebar(id);
        } else {
          setShowLocationSidebar(true);
          if (!isMediumAndUp) {
            setShowLegend(false);
          }
          showLocation(selectedLocation);
        }
      } else {
        previewLocation(selectedLocation);
      }
    }
  }

  function toggleSidebar() {
    var padding = {};

    if (sidebarRef.current.location && sidebarRef.current.legend) {
      if (isMediumAndUp) {
        padding["left"] = 0;
        padding["right"] = 300;
      } else {
        padding["bottom"] = bottomOffset;
      }

      setShowLocationSidebar(false);
    } else if (!sidebarRef.current.location && !sidebarRef.current.legend) {
      if (isMediumAndUp) {
        padding["left"] = 300;
        padding["right"] = 0;
      } else {
        padding["bottom"] = bottomOffset;
      }

      setShowLocationSidebar(true);
    } else if (!sidebarRef.current.location && sidebarRef.current.legend) {
      if (isMediumAndUp) {
        padding["left"] = 300;
        padding["right"] = 300;
      } else {
        padding["bottom"] = bottomOffset;
      }

      setShowLocationSidebar(true);
    } else if (sidebarRef.current.location && !sidebarRef.current.legend) {
      if (isMediumAndUp) {
        padding["left"] = 0;
        padding["right"] = 0;
      } else {
        padding["bottom"] = 0;
      }

      setShowLocationSidebar(false);
    }

    mapRef.current.easeTo({
      center: {
        lat: locationRef.current.latitude,
        lng: locationRef.current.longitude,
      },
      bearing: locationRef.current.bearing,
      pitch: locationRef.current.pitch,
      zoom: locationRef.current.zoom,
      padding: padding,
      duration: 1000,
    });
  }

  function handleRestartQuest() {
    var updatedObjectives = [];
    var updatedItems = [];
    handleUpdateDialogType("begin");
    setOpenDialog(false);

    setTimeout(() => {
      quest.objectives.map((objective) => {
        objective.isComplete = false;
        return updatedObjectives.push(objective);
      });

      quest.items.map((item) => {
        item.isOwned = false;
        return updatedItems.push(item);
      });
      setQuest({
        ...quest,
        objectives: updatedObjectives,
        items: updatedItems,
      });
    }, 150);
  }

  function handleUpdateDialogType(type) {
    setDialogType(type);
  }

  return (
    <React.Fragment>
      <QuestDialog
        quest={quest}
        location={location}
        item={item}
        dialogType={dialogType}
        updateDialogType={handleUpdateDialogType}
        open={openDialog}
        operateQuestItem={operateQuestItem}
        onClose={handleClose}
        beginQuest={handleBeginQuest}
        restartQuest={handleRestartQuest}
      />
      <Grid container direction="column">
        <Grid item>
          <Box overflow="hidden">
            {quest.region && (
              <React.Fragment>
                <MapGL
                  ref={(ref) => (mapRef.current = ref && ref.getMap())}
                  className={classes.questMap}
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
                      <QuestSidebar
                        width={sidebarWidth}
                        toggleSidebar={toggleSidebar}
                        selectMoveAction={handleViewLocation}
                      />
                    )}
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
                      viewLocation={handleViewLocation}
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
                      selectJournalItem={handleSelectJournalItem}
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
                      selectBackpackItem={handleSelectBackpackItem}
                    />
                  </Box>
                  <Box
                    id="sidebarControlPanel"
                    className={
                      classes.sidebarControlPanel +
                      " " +
                      classes.flexCenter +
                      ` ${
                        showLegend || showJournal || showBackpack
                          ? ""
                          : "collapsed"
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
                  {location && location.latitude && (
                    <Popup
                      ref={popupRef}
                      longitude={location.latitude}
                      latitude={location.longitude}
                      closeButton={false}
                      closeOnClick={false}
                      anchor="top"
                      offsetTop={-30}
                    >
                      {location.name}
                    </Popup>
                  )}
                  {quest.locations.map((el, index) => (
                    <QuestMapMarker
                      location={el}
                      key={index}
                      viewLocation={() => handleViewLocation(el.id)}
                    ></QuestMapMarker>
                  ))}
                  {isLoaded && (
                    <GeolocateControl
                      ref={(ref) =>
                        (geolocateRef.current = ref && ref.getControl())
                      }
                      position="bottom-right"
                      positionOptions={{
                        enableHighAccuracy: true,
                        timeout: 3000,
                      }}
                      trackUserLocation={true}
                      fitBoundsOptions={{ maxZoom: 19 }}
                      onError={(err) => console.log(err)}
                      showAccuracyCircle={false}
                      onGeolocate={(result) => setPosition(result.coords)}
                    />
                  )}
                </MapGL>
              </React.Fragment>
            )}
          </Box>
        </Grid>
        <Grid item>
          <BottomNavigation
            onChange={(event, option) => {
              switch (option) {
                case "map":
                  setShowLegend(true);
                  setShowJournal(false);
                  setShowBackpack(false);
                  setShowLocationSidebar(false);
                  return toggleLegend();
                case "notebook":
                  setShowLegend(false);
                  setShowJournal(true);
                  setShowBackpack(false);
                  setShowLocationSidebar(false);
                  return toggleJournal();
                case "backpack":
                  setShowLegend(false);
                  setShowJournal(false);
                  setShowBackpack(true);
                  setShowLocationSidebar(false);
                  return toggleBackpack();
                default:
                  return;
              }
            }}
            showLabels
            className={classes.actionBar}
          >
            <BottomNavigationAction
              label="Legend"
              value="map"
              icon={
                <MapIcon fontSize="inherit" className={classes.actionBarIcon} />
              }
            />
            <BottomNavigationAction
              label="Journal"
              value="notebook"
              icon={
                <NotebookIcon
                  fontSize="inherit"
                  className={classes.actionBarIcon}
                />
              }
            />
            <BottomNavigationAction
              label="Backpack"
              value="backpack"
              icon={
                <BackpackIcon
                  fontSize="inherit"
                  className={classes.actionBarIcon}
                />
              }
            />
          </BottomNavigation>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default QuestPlayer;
