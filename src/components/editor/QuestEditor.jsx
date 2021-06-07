import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

import MapGL, { Source, Layer } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

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

const layerStyle = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

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

const QuestEditor = (props) => {
  const classes = useStyles();
  const {
    quest,
    location,
    entry,
    item,
    action,
    locationIndex,
    addLocation,
    updateLocation,
    removeLocation,
    clearLocation,
    addEntry,
    updateEntry,
    removeEntry,
    clearEntry,
    addItem,
    updateItem,
    removeItem,
    clearItem,
    addAction,
    updateAction,
    removeAction,
    clearAction,
    publishQuest,
    findWithAttr,
    setLocation,
    setLocationIndex,
    entryIndex,
    actionIndex,
    itemIndex,
  } = useContext(QuestContext);

  const viewTab = (event, newTab) => {
    setTab(newTab);
  };

  const [tab, setTab] = useState(0);

  const onMapPointClick = (event) => {
    const { id } = event.features[0].properties;
    const index = findWithAttr(quest.locations, "id", id);
    setLocationIndex(index);
    setLocation(quest.locations[index]);
  };

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
            <QuestItems
              map={
                <MapGL
                  style={{ width: "100%", height: "400px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                >
                  <Source id="locationsData" type="geojson" data={geojson} />
                  <Layer
                    source="locationsData"
                    onClick={onMapPointClick}
                    {...layerStyle}
                  />
                </MapGL>
              }
              region={quest.region}
              objectives={quest.objectives}
              locations={quest.locations}
              locationIndex={locationIndex}
              location={location}
              items={quest.items}
              itemIndex={itemIndex}
              item={item}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
              clearItem={clearItem}
              publishQuest={publishQuest}
            ></QuestItems>
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuestEditor;
