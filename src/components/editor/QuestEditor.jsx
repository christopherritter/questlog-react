import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestDataService from "../../services/QuestService";
import QuestDetails from "./QuestDetails.jsx";
import QuestRegion from "./QuestRegion.jsx";
import QuestObjectives from "./QuestObjectives.jsx";
import QuestLocations from "./QuestLocations.jsx";
import QuestEntries from "./QuestEntries.jsx";
import QuestItems from "./QuestItems.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function QuestEditor(props) {
  const classes = useStyles();

  const [quest, setQuest] = useState({
    questId: "",
    title: "",
    author: "",
    authorId: "",
    description: "",
    categories: [],
    image: "",
    region: {
      latitude: 39.82817,
      longitude: -98.5795,
      bearing: 0,
      pitch: 0,
      zoom: 17,
    },
    objectives: [],
    locations: [],
    entries: [],
    items: [],
    startingPoint: "",
  });

  useEffect(() => {
    const unsubscribe = QuestDataService.getAll()
      .where("questId", "==", props.match.params.questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          return setQuest(doc.data());
        });
      });
    return unsubscribe;
  }, [props.match.params.questId]);

  const onUpdateDetails = (event) => {
    const { name, value } = event.target;
    setQuest({ ...quest, [name]: value });
  };

  const onUpdateRegion = (event) => {
    const { name, value } = event.target;
    setQuest({
      ...quest,
      region: {
        [name]: value,
      },
    });
  };

  const onUpdateCenter = (newRegion) => {
    setQuest({ ...quest, region: newRegion });
  };

  const onAddObjective = (objective) => {
    if (quest.objectives) {
      setQuest({ ...quest, objectives: [...quest.objectives, objective] });
    } else {
      setQuest({ ...quest, objectives: [objective] });
    }
  };

  const onUpdateObjective = (objective) => {
    const selectedObjective = quest.objectives.findIndex(function (obj) {
      return objective.id === obj.id;
    });
    let updatedObjectives = [...quest.objectives];
    let updatedObjective = { ...quest.objectives[selectedObjective] };

    updatedObjective.text = objective.text;
    updatedObjective.isPrimary = objective.isPrimary;
    updatedObjective.isComplete = objective.isComplete;
    updatedObjectives[selectedObjective] = updatedObjective;

    setQuest({ ...quest, objectives: updatedObjectives });
  };

  const onRemoveObjective = (objective) => {
    const updatedObjectives = quest.objectives.filter(
      (obj) => obj.id !== objective.id
    );
    setQuest({ ...quest, objectives: updatedObjectives });
  };

  const onAddLocation = (location) => {
    if (quest.locations) {
      setQuest({ ...quest, locations: [...quest.locations, location] });
    } else {
      setQuest({ ...quest, locations: [location] });
    }
  };

  const onUpdateLocation = (location) => {
    const selectedLocation = quest.locations.findIndex(function (loc) {
      return location.id === loc.id;
    });
    let updatedLocations = [...quest.locations];
    let updatedLocation = { ...quest.locations[selectedLocation] };

    updatedLocation.name = location.name;
    updatedLocation.latitude = location.latitude;
    updatedLocation.longitude = location.longitude;
    updatedLocation.bearing = location.bearing;
    updatedLocation.pitch = location.pitch;
    updatedLocation.zoom = location.zoom;
    updatedLocation.image = location.image;
    updatedLocation.marker = location.marker;
    updatedLocation.order = location.order;
    updatedLocation.isLandmark = location.isLandmark;
    updatedLocation.isStartingPoint = location.isStartingPoint;
    updatedLocations[selectedLocation] = updatedLocation;

    setQuest({ ...quest, locations: updatedLocations });
  };

  const onRemoveLocation = (location) => {
    const updatedLocations = quest.locations.filter(
      (loc) => loc.id !== location.id
    );
    setQuest({ ...quest, locations: updatedLocations });
  };

  const publishQuest = () => {
    QuestDataService.update(quest.questId, quest)
      .then(() => {
        console.log("Updated!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const viewTab = (event, newTab) => {
    setTab(newTab);
  };
  const [tab, setTab] = useState(0);

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container>
        <Grid item md={2}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tab}
            onChange={viewTab}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Region" {...a11yProps(1)} />
            <Tab label="Objectives" {...a11yProps(2)} />
            <Tab label="Locations" {...a11yProps(3)} />
            <Tab label="Entries" {...a11yProps(4)} />
            <Tab label="Items" {...a11yProps(5)} />
          </Tabs>
        </Grid>
        <Grid item md={10}>
          <TabPanel value={tab} index={0}>
            <QuestDetails
              quest={quest}
              updateDetails={onUpdateDetails}
            ></QuestDetails>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <QuestRegion
              map={
                <MapGL
                  style={{ width: "100%", height: "400px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                  updateCenter={onUpdateCenter}
                />
              }
              region={quest.region}
              updateRegion={onUpdateRegion}
              updateCenter={onUpdateCenter}
            ></QuestRegion>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <QuestObjectives
              objectives={quest.objectives}
              addObjective={onAddObjective}
              updateObjective={onUpdateObjective}
              removeObjective={onRemoveObjective}
            ></QuestObjectives>
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <QuestLocations
              map={
                <MapGL
                  style={{ width: "100%", height: "400px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                />
              }
              region={quest.region}
              locations={quest.locations}
              addLocation={onAddLocation}
              updateLocation={onUpdateLocation}
              removeLocation={onRemoveLocation}
            ></QuestLocations>
          </TabPanel>
          <TabPanel value={tab} index={4}>
            <QuestEntries entries={quest.entries}></QuestEntries>
          </TabPanel>
          <TabPanel value={tab} index={5}>
            <QuestItems items={quest.items}></QuestItems>
          </TabPanel>
        </Grid>
      </Grid>

      <Button onClick={publishQuest}>Publish</Button>
    </Paper>
  );
}
