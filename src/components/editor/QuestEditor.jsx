import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const TabPanel = (props) => {
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
};

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

const QuestEditor = () => {
  const classes = useStyles();

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
            aria-label="Quest Editor Tabs"
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
            <QuestDetails />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <QuestRegion />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <QuestObjectives />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <QuestLocations />
          </TabPanel>
          <TabPanel value={tab} index={4}>
            <QuestEntries />
          </TabPanel>
          <TabPanel value={tab} index={5}>
            <QuestItems />
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuestEditor;
