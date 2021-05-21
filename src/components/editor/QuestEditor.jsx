import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import QuestDataService from "../../services/QuestService";
import QuestDetails from "./QuestDetails.jsx";
import QuestRegion from "./QuestRegion.jsx";
import QuestObjectives from "./QuestObjectives.jsx";
import QuestLocations from "./QuestLocations.jsx";
import QuestEntries from "./QuestEntries.jsx";
import QuestItems from "./QuestItems.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

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
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
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
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function QuestEditor(props) {
  const classes = useStyles();

  const initialQuestState = {
    title: "",
    authorId: "",
    description: "",
    categories: [],
    image: "",
    startingPoint: "",
  };
  const [quest, setQuest] = useState(initialQuestState);

  useEffect(() => {
    const unsubscribe = QuestDataService.getAll()
      .where("questId", "==", props.match.params.questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          return setQuest(doc.data())
        });
      });
    return unsubscribe;
  }, [props.match.params.questId]);


  const [region, setRegion] = useState({});
  const [objectives, setObjectives] = useState([]);
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState(0);

  return (
    <div className={classes.root}>
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
      <TabPanel value={value} index={0}>
        <QuestDetails quest={quest}></QuestDetails>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <QuestRegion region={region}></QuestRegion>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <QuestObjectives objectives={objectives}></QuestObjectives>
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
    </div>
  );
}
