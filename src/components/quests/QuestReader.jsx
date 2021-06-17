import React, { useRef, useState, useContext, useEffect } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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

function QuestReader(props) {
  const theme = useTheme();
  const classes = useStyles(props);
  const {
    quest,
    location,
    item,
    setQuest,
    updateCenter,
    selectLocation,
    clearItem,
    viewQuestItem,
    operateQuestItem,
  } = useContext(QuestContext);
  const isMediumAndUp = useMediaQuery(theme.breakpoints.up("md"));

  const [isLoaded, setLoaded] = useState(false);
  const [showLocationSidebar, setShowLocationSidebar] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    const bottomOffset = size.y - 64 - actionBarHeight - mapHeight;
    
    var padding = {
      // bottom: 50,
    };

    if (location) {
      setCurrentLocation(location);
    }

    if (currentLocation) {
      if (!isMediumAndUp) {
        setShowLegend(false);
      }

      if (location.id !== currentLocation.id) {
        if (isMediumAndUp) {
          padding["left"] = 300;
        } else {
          padding["bottom"] = bottomOffset;
        }

        setShowLocationSidebar(true);

        mapRef.current.easeTo({
          center: {
            lat: location.latitude,
            lng: location.longitude,
          },
          bearing: location.bearing,
          pitch: location.pitch,
          zoom: location.zoom,
          padding: padding,
          duration: 1000,
        });
      } else {
        if (showLocationSidebar === true) {
          if (isMediumAndUp) {
            padding["left"] = 0;
          } else {
            padding["bottom"] = 0;
          }

          setShowLocationSidebar(false);

          mapRef.current.easeTo({
            center: {
              lat: location.latitude,
              lng: location.longitude,
            },
            bearing: location.bearing,
            pitch: location.pitch,
            zoom: location.zoom,
            padding: padding,
            duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
          });
        } else {
          if (isMediumAndUp) {
            padding["left"] = 300;
          } else {
            padding["bottom"] = bottomOffset;
          }

          setShowLocationSidebar(true);

          mapRef.current.easeTo({
            center: {
              lat: location.latitude,
              lng: location.longitude,
            },
            padding: padding,
            bearing: location.bearing,
            pitch: location.pitch,
            zoom: location.zoom,
            duration: 1000,
          });
        }
      }
    }
  }, [location]);

  const mapRef = useRef();

  const onLoad = () => {
    setDialogType("begin");
    setLoaded(true);
    setOpen(true);
  };

  function handleBeginQuest() {
    const sortedLocations = quest.locations.sort((a, b) =>
      a.order > b.order ? 1 : -1
    );
    selectLocation(sortedLocations[0].id);
    setOpen(false);
  }

  function toggleLegend() {
    var padding = {
      // bottom: 50,
    };
    if (showLegend === true) {
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
      // bottom: 50,
    };

    selectLocation(formattedLocation);

    if (item.id !== location.id) {
      if (isMediumAndUp) {
        padding["left"] = 300;
      } else {
        padding["bottom"] = bottomOffset;
      }

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
        if (isMediumAndUp) {
          padding["left"] = 0;
        } else {
          padding["bottom"] = 0;
        }

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
        if (isMediumAndUp) {
          padding["left"] = 300;
        } else {
          padding["bottom"] = bottomOffset;
        }

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
      // bottom: 50,
    };
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
    setDialogType(null);
    setOpen(true);
  }

  function toggleBackpack() {
    var padding = {
      // bottom: 50,
    };
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
    setDialogType("item");
    setOpen(true);
  }

  function toggleSidebar() {
    handleViewLocation(location);
  }

  function handleViewLocation(selectedLocation) {
    setDialogType(null);
    selectLocation(selectedLocation.id);
    setCurrentLocation((current) => ({ ...current, ...selectedLocation }));
  }

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  function handleRestartQuest() {
    var updatedObjectives = [];
    var updatedItems = [];
    setOpen(false);

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

  const [dialogType, setDialogType] = React.useState();

  const handleUpdateDialogType = (type) => {
    setDialogType(type);
  }

  useEffect(() => {
    var questComplete = true;

    if (quest.objectives && quest.objectives.length > 0) {
      quest.objectives
        .filter((objective) => objective.isPrimary === true)
        .forEach((objective) => {
          if (objective.isComplete === false) questComplete = false;
        });

      if (questComplete) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }, [quest.objectives]);

  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const updateSize = () =>
    setSize({
      x: window.innerWidth,
      y: window.innerHeight,
    });
  useEffect(() => (window.onresize = updateSize), []);

  const bottomOffset = size.y - 64 - actionBarHeight - mapHeight;

  return (
    <React.Fragment>
      <QuestDialog
        quest={quest}
        location={location}
        item={item}
        dialogType={dialogType}
        updateDialogType={handleUpdateDialogType}
        open={open}
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
                      selectLegendItem={selectLegendItem}
                      viewLocation={handleViewLocation}
                      selectLocation={selectLocation}
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
                  {quest.locations.map((el, index) => (
                    <QuestMapMarker
                      location={el}
                      key={index}
                      viewLocation={handleViewLocation}
                    ></QuestMapMarker>
                  ))}
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
              icon={<MapIcon fontSize="inherit" className={classes.actionBarIcon} />}
            />
            <BottomNavigationAction
              label="Journal"
              value="notebook"
              icon={<NotebookIcon fontSize="inherit" className={classes.actionBarIcon} />}
            />
            <BottomNavigationAction
              label="Backpack"
              value="backpack"
              icon={<BackpackIcon fontSize="inherit" className={classes.actionBarIcon} />}
            />
          </BottomNavigation>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default QuestReader;
