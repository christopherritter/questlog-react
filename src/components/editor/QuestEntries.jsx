import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ListAltIcon from "@material-ui/icons/ListAlt";
import MapIcon from "@material-ui/icons/Map";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

function QuestEntries(props) {
  const classes = useStyles();
  var id = 0;

  if (props.entries && props.entries.length > 0) {
    var idList = props.entries.map((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      return idNumber;
    });

    id = Math.max(...idList) + 1;
  }

  const useRefState = (initialValue) => {
    const [state, setState] = useState(initialValue);
    const stateRef = useRef(state);
    useEffect(() => {
      stateRef.current = state;
    }, [state]);
    return [state, stateRef, setState];
  };

  const initialEntryState = {
    id: "entry-" + id,
    title: "",
    text: "",
    locationId: "",
    order: 0,
    actions: [],
    objectives: [],
    requirements: [],
    expiration: [],
  };

  const [entry, entryRef, setEntry] = useRefState(initialEntryState);

  useEffect(() => {
    if (props.entry) {
      setEntry(props.entry);
    }
  }, [props.entry, setEntry]);

  const onChangeEntry = (event) => {
    const { name, value } = event.target;
    setEntry({ ...entry, [name]: value });
  };

  const onSelectLocation = (event) => {
    const { name, value } = event.target;
    setEntry({ ...entry, [name]: value });
  };

  const addEntry = (e) => {
    e.preventDefault();
    props.addEntry({
      id: "entry-" + id,
      ...entry,
    });
    setEntry(initialEntryState);
    setSelectedIndex(-1);
  };

  const updateEntry = (e) => {
    e.preventDefault();
    props.updateEntry({ ...entry });
    props.clearEntry();
    setEntry(initialEntryState);
    setSelectedIndex(-1);
  };

  const removeEntry = (e) => {
    e.preventDefault();
    props.removeEntry(entry);
    setEntry(initialEntryState);
    setSelectedIndex(-1);
  };

  const [view, setView] = React.useState("list");

  const handleView = (event, newView) => {
    setView(newView);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useEffect(() => {
    setSelectedIndex(props.entryIndex);
  }, [props.entryIndex]);

  const [viewport, setViewport] = useState(props.region);

  const mapClick = (event) => {
    const { lngLat } = event;
    const updatedEntry = {
      ...entryRef.current,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };
    setEntry(updatedEntry);
  };

  const EntryList = () => {
    return (
      <>
        {props.locations &&
          props.locations.map((location) => {
            return (
              <List
                key={location.id}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    { location.name }
                  </ListSubheader>
                }
              >
                {props.entries &&
                  props.entries
                    .filter((entry) => {
                      return entry.locationId === location.id;
                    })
                    .map((entry, index) => {
                      return (
                        <ListItem
                          button
                          key={entry.id}
                          selected={selectedIndex === index}
                          onClick={(event) => handleListItemClick(entry, index)}
                        >
                          <ListItemIcon>
                            <MenuBookIcon />
                          </ListItemIcon>
                          <ListItemText primary={entry.title} />
                        </ListItem>
                      );
                    })}
              </List>
            );
          })}
      </>
    );
  };

  const QuestMap = React.cloneElement(props.map, {
    latitude: viewport.latitude,
    longitude: viewport.longitude,
    bearing: viewport.bearing,
    pitch: viewport.pitch,
    zoom: viewport.zoom,
    onViewportChange: setViewport,
    onClick: mapClick,
  });

  const renderView = (view) => {
    switch (view) {
      case "list":
        var entryList = EntryList();
        return entryList;
      default:
        return QuestMap;
    }
  };

  const handleListItemClick = (entry, index) => {
    const selectedEntry = { ...entry };
    setSelectedIndex(index);
    setEntry(selectedEntry);
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item md={4} sm={12}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <h2>Entries</h2>
          </Grid>
          <Grid item md={4}>
            <Button
              color="primary"
              onClick={() => {
                props.clearEntry();
                setEntry(initialEntryState);
                setSelectedIndex(-1);
              }}
            >
              Create New
            </Button>
          </Grid>
        </Grid>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item sm={8}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="entryTitle"
                label="Entry Title"
                name="title"
                type="text"
                value={entry.title}
                onChange={onChangeEntry}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="entryOrder"
                label="Order"
                name="order"
                type="number"
                value={entry.order}
                onChange={onChangeEntry}
              />
            </Grid>
          </Grid>

          <FormControl
            variant="outlined"
            required
            fullWidth
            className={classes.formControl}
          >
            <InputLabel htmlFor="entryLocation">Location</InputLabel>
            <Select
              native
              value={entry.locationId}
              onChange={onSelectLocation}
              label="Location"
              inputProps={{
                name: "locationId",
                id: "entryLocation",
              }}
            >
              <option value={undefined}></option>
              {props.locations &&
                props.locations.map((location) => {
                  return (
                    <option value={location.id} key={location.id}>
                      {location.name}
                    </option>
                  );
                })}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="entryText"
            label="Text"
            name="text"
            type="text"
            multiline
            rows={4}
            value={entry.text}
            onChange={onChangeEntry}
          />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectedIndex === -1 ? (
                <Button color="primary" onClick={addEntry}>
                  Add Entry
                </Button>
              ) : (
                <>
                  <Button color="primary" onClick={updateEntry}>
                    Update
                  </Button>
                  <Button color="primary" onClick={removeEntry}>
                    Remove
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item md={8} sm={12}>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleView}
              aria-label="editor view"
            >
              <ToggleButton value="list" aria-label="list view">
                <ListAltIcon />
              </ToggleButton>
              <ToggleButton value="map" aria-label="map view">
                <MapIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            {renderView(view)}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

QuestEntries.propTypes = {};

export default QuestEntries;
