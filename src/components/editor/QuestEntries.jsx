import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
  inline: {
    display: "inline",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
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
    expirations: [],
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

  const onChangeObjectives = (event) => {
    const currentValue = event.target.value[0];
    const objectives = [...entry.objectives];
    const index = objectives.indexOf(currentValue);

    if (index === -1) {
      objectives.push(currentValue);
    } else {
      objectives.splice(index, 1);
    }

    setEntry({ ...entry, objectives: objectives });
  };

  const onChangeRequirements = (event) => {
    const currentValue = event.target.value[0];
    const requirements = [...entry.requirements];
    const index = requirements.indexOf(currentValue);

    if (index === -1) {
      requirements.push(currentValue);
    } else {
      requirements.splice(index, 1);
    }

    setEntry({ ...entry, requirements: requirements });
  };

  const onChangeExpirations = (event) => {
    const currentValue = event.target.value[0];
    const expirations = [...entry.expirations];
    const index = expirations.indexOf(currentValue);

    if (index === -1) {
      expirations.push(currentValue);
    } else {
      expirations.splice(index, 1);
    }

    setEntry({ ...entry, expirations: expirations });
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

  const handleListItemClick = (entry, index) => {
    const selectedEntry = { ...entry };
    setSelectedIndex(index);
    setEntry(selectedEntry);
  };

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
      <List component="nav" subheader={<li />}>
        {props.locations &&
          props.locations.map((location) => (
            <li key={location.id}>
              <ul>
                <ListSubheader>{location.name}</ListSubheader>
                {props.entries &&
                  props.entries
                    .filter((entry) => {
                      return entry.locationId === location.id;
                    })
                    .map((entry, index) => (
                      <ListItem
                        button
                        key={entry.id}
                        selected={selectedIndex === entry.id}
                        onClick={(event) =>
                          handleListItemClick(entry, entry.id)
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h6" gutterBottom>
                              {entry.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              style={{ whiteSpace: "pre-line" }}
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {entry.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
              </ul>
            </li>
          ))}
      </List>
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4} sm={12}>
          <Typography variant="h4" gutterBottom>
            Entries
          </Typography>
        </Grid>
        <Grid item md={8} sm={12}>
          <Button
            onClick={() => {
              props.clearEntry();
              setEntry(initialEntryState);
              setSelectedIndex(-1);
            }}
          >
            Create New
          </Button>
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
      <Grid container spacing={2} className={classes.root}>
        <Grid item md={4} sm={12}>
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
              label="Entry"
              name="text"
              type="text"
              multiline
              rows={8}
              value={entry.text}
              onChange={onChangeEntry}
            />

            <FormControl
              variant="outlined"
              fullWidth
              className={classes.formControl}
            >
              <InputLabel id="objectives-multi-select-label">
                Objectives
              </InputLabel>
              <Select
                labelId="objectives-multi-select-label"
                id="objectives-multi-select"
                multiple
                value={entry.objectives}
                onChange={onChangeObjectives}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {props.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={entry.objectives.indexOf(objective.id) > -1}
                    />
                    <ListItemText primary={objective.text} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              fullWidth
              className={classes.formControl}
            >
              <InputLabel id="requirements-multi-select-label">
                Requirements
              </InputLabel>
              <Select
                labelId="requirements-multi-select-label"
                id="requirements-multi-select"
                multiple
                value={entry.requirements}
                onChange={onChangeRequirements}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {props.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={entry.requirements.indexOf(objective.id) > -1}
                    />
                    <ListItemText primary={objective.text} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              fullWidth
              className={classes.formControl}
            >
              <InputLabel id="expirations-multi-select-label">
                Expirations
              </InputLabel>
              <Select
                labelId="expirations-multi-select-label"
                id="expirations-multi-select"
                multiple
                value={entry.expirations}
                onChange={onChangeExpirations}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {props.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={entry.expirations.indexOf(objective.id) > -1}
                    />
                    <ListItemText primary={objective.text} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </Grid>
        <Grid item md={8} sm={12}>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              {renderView(view)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
        <Box flexGrow={1}>
          {selectedIndex === -1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={addEntry}
              className={classes.button}
            >
              Add Entry
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={updateEntry}
                className={classes.button}
              >
                Update
              </Button>
              <Button
                variant="contained"
                onClick={removeEntry}
                className={classes.button}
              >
                Remove
              </Button>
            </>
          )}
        </Box>
        <Box flexGrow={0}>
          <Button
            variant="contained"
            color="secondary"
            onClick={props.publishQuest}
            className={classes.button}
          >
            Publish
          </Button>
        </Box>
      </Box>
    </>
  );
}

QuestEntries.propTypes = {};

export default QuestEntries;
