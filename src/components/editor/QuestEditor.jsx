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
  // layout: {
  //   width: "auto",
  //   marginLeft: theme.spacing(2),
  //   marginRight: theme.spacing(2),
  //   [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
  //     width: 600,
  //     marginLeft: "auto",
  //     marginRight: "auto",
  //   },
  // },
}));

export default function QuestEditor(props) {
  const classes = useStyles();

  const initialQuestState = {
    questId: "",
    title: "",
    author: "",
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
          return setQuest(doc.data());
        });
      });
    return unsubscribe;
  }, [props.match.params.questId]);

  const onUpdateDetails = (event) => {
    const { name, value } = event.target;
    setQuest({ ...quest, [name]: value });
  };

  const initialRegionState = {
    coordinates: [],
    name: "",
    zoom: 17,
  };
  const [region, setRegion] = useState(initialRegionState);

  const onUpdateRegion = (event) => {
    const { name, value } = event.target;
    setRegion({ ...region, [name]: value });
  };

  const [objectives, setObjectives] = useState([]);
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = useState(0);

  const publishQuest = () => {
    QuestDataService.update(quest.questId, { quest, region })
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
        <Grid item sm={3}>
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
        <Grid item sm={9}>
          <TabPanel value={value} index={0}>
            <QuestDetails
              quest={quest}
              updateDetails={onUpdateDetails}
            ></QuestDetails>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <QuestRegion
              region={region}
              updateRegion={onUpdateRegion}
            ></QuestRegion>
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
        </Grid>
      </Grid>

      <Button onClick={publishQuest}>Publish</Button>
    </Paper>
  );
}
