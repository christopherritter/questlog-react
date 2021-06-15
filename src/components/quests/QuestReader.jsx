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

import { makeStyles } from "@material-ui/core/styles";
import { green, pink } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import MapIcon from "mdi-material-ui/Map";
import NotebookIcon from "mdi-material-ui/Notebook";
import BackpackIcon from "mdi-material-ui/BagPersonal";

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
  questMap: {
    width: "100%",
    height: "calc(100vh - 64px)",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 64px - 56px)",
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
  actionBar: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function QuestReader(props) {
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

  const [isLoaded, setLoaded] = useState(false);
  const [showLocationSidebar, setShowLocationSidebar] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentLocation, setCurrentLocation] = useState();

  useEffect(() => {
    var padding = {
      // bottom: 50,
    };

    if (location) {
      setCurrentLocation(location);
    }

    if (currentLocation) {
      if (location.id !== currentLocation.id) {
        padding["left"] = 300;

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
          padding["left"] = 0; // In px, matches the width of the sidebars set in .sidebar CSS class

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
          padding["left"] = 300;

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
    setDialogType("begin")
    setLoaded(true);
    setOpen(true)
  };

  function handleBeginQuest() {
    const sortedLocations = quest.locations.sort((a, b) => (a.order > b.order) ? 1 : -1)
    selectLocation(sortedLocations[0].id);
    setOpen(false);
  }

  function toggleLegend() {
    var padding = {
      // bottom: 50,
    };
    if (showLegend === true) {
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
      // bottom: 50,
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
      // bottom: 50,
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

  function handleSelectJournalItem() {
    setDialogType(null);
    setOpen(true);
  }

  function toggleBackpack() {
    var padding = {
      // bottom: 50,
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

  return (
    <React.Fragment>
      <QuestDialog
        quest={quest}
        location={location}
        item={item}
        dialogType={dialogType}
        open={open}
        operateQuestItem={operateQuestItem}
        onClose={handleClose}
        beginQuest={handleBeginQuest}
        restartQuest={handleRestartQuest}
      />
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
      <BottomNavigation
        onChange={(event, option) => {
          switch (option) {
            case "map":
              setShowLegend(true);
              setShowJournal(false);
              setShowBackpack(false);
              return toggleLegend();
            case "notebook":
              setShowLegend(false);
              setShowJournal(true);
              setShowBackpack(false);
              return toggleJournal();
            case "backpack":
              setShowLegend(false);
              setShowJournal(false);
              setShowBackpack(true);
              return toggleBackpack();
            default:
              return;
          }
        }}
        showLabels
        className={classes.actionBar}
      >
        <BottomNavigationAction label="Legend" value="map" icon={<MapIcon />} />
        <BottomNavigationAction
          label="Journal"
          value="notebook"
          icon={<NotebookIcon />}
        />
        <BottomNavigationAction
          label="Backpack"
          value="backpack"
          icon={<BackpackIcon />}
        />
      </BottomNavigation>
    </React.Fragment>
  );
}

export default QuestReader;
