import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import QuestDataService from "../../services/QuestService";
import QuestDetails from "./QuestDetails.jsx";
import QuestRegion from "./QuestRegion.jsx";
import QuestObjectives from "./QuestObjectives.jsx";
import QuestLocations from "./QuestLocations.jsx";
import QuestEntries from "./QuestEntries.jsx";
import QuestItems from "./QuestItems.jsx";
import QuestMap from "../quests/QuestMap.jsx";

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

  // const [objectives, setObjectives] = useState([]);

  const onAddObjective = (objective) => {
    if (quest.objectives) {
      setQuest({ ...quest, objectives: [...quest.objectives, objective]});
    } else {
      setQuest({ ...quest, objectives: [objective]});
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

    setQuest({ ...quest, objectives: updatedObjectives});
  };

  const onRemoveObjective = (objective) => {
    const updatedObjectives = quest.objectives.filter(
      (obj) => obj.id !== objective.id
    );
    setQuest({ ...quest, objectives: updatedObjectives});
  };

  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState(0);

  const publishQuest = () => {
    QuestDataService.update(quest.questId, quest)
      .then(() => {
        console.log("Updated!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container>
        <Grid item md={2}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
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
          <TabPanel value={value} index={0}>
            <QuestDetails
              quest={quest}
              updateDetails={onUpdateDetails}
            ></QuestDetails>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <QuestRegion
              map={
                <QuestMap
                  width={"100%"}
                  height={"400px"}
                  latitude={quest.region.latitude}
                  longitude={quest.region.longitude}
                  bearing={quest.region.bearing}
                  pitch={quest.region.pitch}
                  zoom={quest.region.zoom}
                ></QuestMap>
              }
              region={quest.region}
              updateRegion={onUpdateRegion}
              updateCenter={onUpdateCenter}
            ></QuestRegion>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <QuestObjectives
              objectives={quest.objectives}
              addObjective={onAddObjective}
              updateObjective={onUpdateObjective}
              removeObjective={onRemoveObjective}
            ></QuestObjectives>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <QuestLocations locations={locations}></QuestLocations>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <QuestEntries entries={entries}></QuestEntries>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <QuestItems items={items}></QuestItems>
          </TabPanel>
        </Grid>
      </Grid>

      <Button onClick={publishQuest}>Publish</Button>
    </Paper>
  );
}
