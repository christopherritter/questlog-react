import React, { useState, useEffect, useRef, useContext } from "react";

import QuestContext from "../../contexts/QuestContext.jsx";

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
  },
}));

const QuestItems = (props) => {
  const classes = useStyles();
  const {
    quest,
    itemIndex,
    addItem,
    updateItem,
    clearItem,
    removeItem,
    publishQuest,
  } = useContext(QuestContext);
  var id = 0;

  if (quest.items && quest.items.length > 0) {
    var idList = quest.items.map((obj) => {
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

  const initialItemState = {
    id: "item-" + id,
    name: "",
    description: "",
    locationId: "",
    order: 0,
    actions: [],
    objectives: [],
    requirements: [],
    expirations: [],
  };

  const [item, itemRef, setItem] = useRefState(initialItemState);

  // useEffect(() => {
  //   if (props.item) {
  //     setItem(props.item);
  //   }
  // }, [props.item, setItem]);

  function handleChangeItem(event) {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  }

  function handleChangeObjectives(event) {
    const currentValue = event.target.value[0];
    const objectives = [...item.objectives];
    const index = objectives.indexOf(currentValue);

    if (index === -1) {
      objectives.push(currentValue);
    } else {
      objectives.splice(index, 1);
    }

    setItem({ ...item, objectives: objectives });
  }

  function handleChangeRequirements(event) {
    const currentValue = event.target.value[0];
    const requirements = [...item.requirements];
    const index = requirements.indexOf(currentValue);

    if (index === -1) {
      requirements.push(currentValue);
    } else {
      requirements.splice(index, 1);
    }

    setItem({ ...item, requirements: requirements });
  }

  function handleChangeExpirations(event) {
    const currentValue = event.target.value[0];
    const expirations = [...item.expirations];
    const index = expirations.indexOf(currentValue);

    if (index === -1) {
      expirations.push(currentValue);
    } else {
      expirations.splice(index, 1);
    }

    setItem({ ...item, expirations: expirations });
  };

  function handleSelectLocation(event) {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  function handleAddItem(e) {
    e.preventDefault();
    addItem({
      id: "item-" + id,
      ...item,
    });
    setItem(initialItemState);
    setSelectedIndex(-1);
  };

  function handleUpdateItem(e) {
    e.preventDefault();
    updateItem({ ...item });
    clearItem();
    setItem(initialItemState);
    setSelectedIndex(-1);
  };

  function handleRemoveItem(e) {
    e.preventDefault();
    removeItem(item);
    setItem(initialItemState);
    setSelectedIndex(-1);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useEffect(() => {
    setSelectedIndex(itemIndex);
  }, [itemIndex]);

  const handleListItemClick = (item, index) => {
    const selectedItem = { ...item };
    setSelectedIndex(index);
    setItem(selectedItem);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={4} sm={12}>
          <Typography variant="h4" gutterBottom>
            Items
          </Typography>
        </Grid>
        <Grid item md={8} sm={12}>
          <Button
            onClick={() => {
              props.clearItem();
              setItem(initialItemState);
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
                  id="itemName"
                  label="Item Name"
                  name="name"
                  type="text"
                  value={item.name}
                  onChange={handleChangeItem}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="itemOrder"
                  label="Order"
                  name="order"
                  type="number"
                  value={item.order}
                  onChange={handleChangeItem}
                />
              </Grid>
            </Grid>

            <FormControl
              variant="outlined"
              required
              fullWidth
              className={classes.formControl}
            >
              <InputLabel htmlFor="itemLocation">Location</InputLabel>
              <Select
                native
                value={item.locationId}
                onChange={handleSelectLocation}
                label="Location"
                inputProps={{
                  name: "locationId",
                  id: "itemLocation",
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
              id="itemDescription"
              label="Description"
              name="description"
              type="text"
              multiline
              rows={8}
              value={item.description}
              onChange={handleChangeItem}
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
                value={item.objectives}
                onChange={handleChangeObjectives}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {quest.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={item.objectives.indexOf(objective.id) > -1}
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
                value={item.requirements}
                onChange={handleChangeRequirements}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {quest.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={item.requirements.indexOf(objective.id) > -1}
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
                value={item.expirations}
                onChange={handleChangeExpirations}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {quest.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={item.expirations.indexOf(objective.id) > -1}
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
                {props.locations &&
                  props.locations.map((location) => (
                    <li key={location.id}>
                      <ul>
                        <ListSubheader>{location.name}</ListSubheader>
                        {quest.items &&
                          quest.items
                            .filter((item) => {
                              return item.locationId === location.id;
                            })
                            .map((item, index) => (
                              <ListItem
                                button
                                key={item.id}
                                selected={selectedIndex === item.id}
                                onClick={(event) =>
                                  handleListItemClick(item, item.id)
                                }
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="h6" gutterBottom>
                                      {item.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography
                                      style={{ whiteSpace: "pre-line" }}
                                      variant="body2"
                                      className={classes.inline}
                                      color="textPrimary"
                                    >
                                      {item.description}
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
              onClick={handleAddItem}
              className={classes.button}
            >
              Add Item
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateItem}
                className={classes.button}
              >
                Update
              </Button>
              <Button
                variant="contained"
                onClick={handleRemoveItem}
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
        </Box>
      </Box>
    </>
  );
};

QuestItems.propTypes = {};

export default QuestItems;
