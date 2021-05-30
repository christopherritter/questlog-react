import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MapGL, { Source, Layer } from "@urbica/react-map-gl";
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

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

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

  const [locationIndex, setLocationIndex] = useState(-1);

  const [location, setLocation] = useState();

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
    setLocationIndex(-1);
    setLocation(null);
  };

  const onClearLocation = () => {
    setLocationIndex(-1);
    setLocation(null);
  };

  // Entries
  // Short text entries that are displayed at a location
  // Usually provide readers with a set of actions to choose from

  const [entryIndex, setEntryIndex] = useState(-1);

  const [entry, setEntry] = useState();

  const onAddEntry = (entry) => {
    if (quest.entries) {
      setQuest({ ...quest, entries: [...quest.entries, entry] });
    } else {
      setQuest({ ...quest, entries: [entry] });
    }
  };

  const onUpdateEntry = (entry) => {
    const selectedEntry = quest.entries.findIndex(function (ent) {
      return entry.id === ent.id;
    });
    let updatedEntries = [...quest.entries];
    let updatedEntry = { ...quest.entries[selectedEntry] };

    updatedEntry = { ...entry };
    updatedEntries[selectedEntry] = updatedEntry;

    setQuest({ ...quest, entries: updatedEntries });
  };

  const onRemoveEntry = (entry) => {
    const updatedEntries = quest.entries.filter((ent) => ent.id !== entry.id);
    setQuest({ ...quest, entries: updatedEntries });
    setEntryIndex(-1);
    setEntry(null);
  };

  const onClearEntry = () => {
    setEntryIndex(-1);
    setEntry(null);
  };

  // Items
  // Short descriptions of things that can fit inside a backpack
  // Usually provide readers with a set of actions to choose from

  const [itemIndex, setItemIndex] = useState(-1);

  const [item, setItem] = useState();

  const onAddItem = (item) => {
    if (quest.items) {
      setQuest({ ...quest, items: [...quest.items, item] });
    } else {
      setQuest({ ...quest, items: [item] });
    }
  };

  const onUpdateItem = (item) => {
    const selectedItem = quest.items.findIndex(function (i) {
      return item.id === i.id;
    });
    let updatedItems = [...quest.items];
    let updatedItem = { ...quest.items[selectedItem] };

    updatedItem = { ...item };
    updatedItems[selectedItem] = updatedItem;

    setQuest({ ...quest, items: updatedItems });
  };

  const onRemoveItem = (item) => {
    const updatedItems = quest.items.filter((i) => i.id !== item.id);
    setQuest({ ...quest, items: updatedItems });
    setItemIndex(-1);
    setItem(null);
  };

  const onClearItem = () => {
    setItemIndex(-1);
    setItem(null);
  };

  const onPublishQuest = () => {
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
            <QuestDetails
              quest={quest}
              updateDetails={onUpdateDetails}
              publishQuest={onPublishQuest}
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
              publishQuest={onPublishQuest}
            ></QuestRegion>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <QuestObjectives
              objectives={quest.objectives}
              addObjective={onAddObjective}
              updateObjective={onUpdateObjective}
              removeObjective={onRemoveObjective}
              publishQuest={onPublishQuest}
            ></QuestObjectives>
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <QuestLocations
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
              locations={quest.locations}
              locationIndex={locationIndex}
              location={location}
              addLocation={onAddLocation}
              updateLocation={onUpdateLocation}
              removeLocation={onRemoveLocation}
              clearLocation={onClearLocation}
              publishQuest={onPublishQuest}
            ></QuestLocations>
          </TabPanel>
          <TabPanel value={tab} index={4}>
            <QuestEntries
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
              entries={quest.entries}
              entryIndex={entryIndex}
              entry={entry}
              addEntry={onAddEntry}
              updateEntry={onUpdateEntry}
              removeEntry={onRemoveEntry}
              clearEntry={onClearEntry}
              publishQuest={onPublishQuest}
            ></QuestEntries>
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
              addItem={onAddItem}
              updateItem={onUpdateItem}
              removeItem={onRemoveItem}
              clearItem={onClearItem}
              publishQuest={onPublishQuest}
            ></QuestItems>
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
}
