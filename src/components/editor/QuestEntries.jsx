import React, { useState, useEffect, useRef, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import QuestContext from "../../contexts/QuestContext.jsx";
import QuestActions from "./QuestActions.jsx";

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
    marginLeft: theme.spacing(1)
  },
}));

const QuestEntries = () => {
  const classes = useStyles();
  const {
    quest,
    entryIndex,
    addEntry,
    updateEntry,
    clearEntry,
    removeEntry,
    publishQuest,
  } = useContext(QuestContext);
  var id = 0;

  if (quest.entries && quest.entries.length > 0) {
    var idList = quest.entries.map((obj) => {
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

  // useEffect(() => {
  //   if (entry) {
  //     setEntry(props.entry);
  //   }
  // }, [props.entry, setEntry]);

  function handleChangeEntry(event) {
    const { name, value } = event.target;
    setEntry({ ...entry, [name]: value });
  };

  function handleChangeObjectives(event) {
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

  function handleChangeRequirements(event) {
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

  function handleChangeExpirations(event) {
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

  function handleSelectLocation(event) {
    const { name, value } = event.target;
    setEntry({ ...entry, [name]: value });
  };

  function handleAddEntry(e) {
    e.preventDefault();
    addEntry({
      id: "entry-" + id,
      ...entry,
    });
    setEntry(initialEntryState);
    setSelectedIndex(-1);
  }

  function handleUpdateEntry(e) {
    e.preventDefault();
    updateEntry({ ...entry });
    clearEntry();
    setEntry(initialEntryState);
    setSelectedIndex(-1);
  }

  function handleRemoveEntry(e) {
    e.preventDefault();
    removeEntry(entry);
    setEntry(initialEntryState);
    setSelectedIndex(-1);
  }

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // useEffect(() => {
  //   setSelectedIndex(entryIndex);
  // }, [entryIndex]);

  function handleListItemClick(entry, index) {
    const selectedEntry = { ...entry };
    setSelectedIndex(index);
    setEntry(selectedEntry);
  };

  function handleAddAction(id) {
    const actionsArr = [ ...entry.actions ];
    actionsArr.push(id)

    setEntry({ ...entry, actions: actionsArr });
  }

  function handleRemoveAction(action) {
    console.log("Handle remove action")
    
    const updatedActions = entry.actions.filter((a) => a !== action.id);

    console.log(updatedActions)
    setEntry({ ...entry, actions: updatedActions });
  }

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
              clearEntry();
              setEntry(initialEntryState);
              setSelectedIndex(-1);
            }}
          >
            Create New
          </Button>
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
                  onChange={handleChangeEntry}
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
                  onChange={handleChangeEntry}
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
                onChange={handleSelectLocation}
                label="Location"
                inputProps={{
                  name: "locationId",
                  id: "entryLocation",
                }}
              >
                <option value={undefined}></option>
                {quest.locations &&
                  quest.locations.map((location) => {
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
              onChange={handleChangeEntry}
            />

            <QuestActions
              // action={props.action}
              actions={entry.actions}
              addActionToEntry={handleAddAction}
              removeActionFromEntry={handleRemoveAction}
              // updateAction={updateAction}
              // removeAction={removeAction}
              // clearAction={clearAction}
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
                onChange={handleChangeObjectives}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {quest.objectives.map((objective) => (
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
                onChange={handleChangeRequirements}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {quest.objectives.map((objective) => (
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
                onChange={handleChangeExpirations}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {quest.objectives.map((objective) => (
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
              <List component="nav" subheader={<li />}>
                {quest.locations &&
                  quest.locations.map((location) => (
                    <li key={location.id}>
                      <ul>
                        <ListSubheader>{location.name}</ListSubheader>
                        {quest.entries &&
                          quest.entries
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
              onClick={handleAddEntry}
              className={classes.button}
            >
              Add Entry
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateEntry}
                className={classes.button}
              >
                Update
              </Button>
              <Button
                variant="contained"
                onClick={handleRemoveEntry}
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
            onClick={publishQuest}
            className={classes.button}
          >
            Publish
          </Button>
          <Button
          variant="contained"
          color="default"
          component={RouterLink}
          to={`/quest/` + quest.questId + `/read`}
          className={classes.button}
        >
          Read
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={`/quest/` + quest.questId + `/play`}
          className={classes.button}
        >
          Play
        </Button>
        </Box>
      </Box>
    </>
  );
}

export default QuestEntries;
