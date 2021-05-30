import React, { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
}));

function QuestItems(props) {
  const classes = useStyles();
  var id = 0;

  if (props.items && props.items.length > 0) {
    var idList = props.items.map((obj) => {
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

  useEffect(() => {
    if (props.item) {
      setItem(props.item);
    }
  }, [props.item, setItem]);

  const onChangeItem = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const onChangeObjectives = (event) => {
    const currentValue = event.target.value[0];
    const objectives = [...item.objectives];
    const index = objectives.indexOf(currentValue);

    if (index === -1) {
      objectives.push(currentValue);
    } else {
      objectives.splice(index, 1);
    }

    setItem({ ...item, objectives: objectives });
  };

  const onChangeRequirements = (event) => {
    const currentValue = event.target.value[0];
    const requirements = [...item.requirements];
    const index = requirements.indexOf(currentValue);

    if (index === -1) {
      requirements.push(currentValue);
    } else {
      requirements.splice(index, 1);
    }

    setItem({ ...item, requirements: requirements });
  };

  const onChangeExpirations = (event) => {
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

  const onSelectLocation = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const addItem = (e) => {
    e.preventDefault();
    props.addItem({
      id: "item-" + id,
      ...item,
    });
    setItem(initialItemState);
    setSelectedIndex(-1);
  };

  const updateItem = (e) => {
    e.preventDefault();
    props.updateItem({ ...item });
    props.clearItem();
    setItem(initialItemState);
    setSelectedIndex(-1);
  };

  const removeItem = (e) => {
    e.preventDefault();
    props.removeItem(item);
    setItem(initialItemState);
    setSelectedIndex(-1);
  };

  const [view, setView] = React.useState("list");

  const handleView = (event, newView) => {
    setView(newView);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useEffect(() => {
    setSelectedIndex(props.itemIndex);
  }, [props.itemIndex]);

  const handleListItemClick = (item, index) => {
    const selectedItem = { ...item };
    setSelectedIndex(index);
    setItem(selectedItem);
  };

  const [viewport, setViewport] = useState(props.region);

  const mapClick = (event) => {
    const { lngLat } = event;
    const updatedItem = {
      ...itemRef.current,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };
    setItem(updatedItem);
  };

  const ItemList = () => {
    return (
      <List component="nav" subheader={<li />}>
        {props.locations &&
          props.locations.map((location) => (
            <li key={location.id}>
              <ul>
                <ListSubheader>{location.name}</ListSubheader>
                {props.items &&
                  props.items
                    .filter((item) => {
                      return item.locationId === location.id;
                    })
                    .map((item, index) => (
                      <ListItem
                        button
                        key={item.id}
                        selected={selectedIndex === item.id}
                        onClick={(event) => handleListItemClick(item, item.id)}
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
        var itemList = ItemList();
        return itemList;
      default:
        return QuestMap;
    }
  };

  return (
    <>
      <Grid container spacing={2} className={classes.root}>
        <Grid item md={4} sm={12}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Typography variant="h4" gutterBottom>
                Items
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Button
                color="primary"
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
                  onChange={onChangeItem}
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
                  onChange={onChangeItem}
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
                onChange={onSelectLocation}
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
              onChange={onChangeItem}
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
                onChange={onChangeObjectives}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {props.objectives.map((objective) => (
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
                onChange={onChangeRequirements}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {props.objectives.map((objective) => (
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
                onChange={onChangeExpirations}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
              >
                {props.objectives.map((objective) => (
                  <MenuItem key={objective.id} value={objective.id}>
                    <Checkbox
                      checked={item.expirations.indexOf(objective.id) > -1}
                    />
                    <ListItemText primary={objective.text} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                {selectedIndex === -1 ? (
                  <Button color="primary" onClick={addItem}>
                    Add Item
                  </Button>
                ) : (
                  <>
                    <Button color="primary" onClick={updateItem}>
                      Update
                    </Button>
                    <Button color="primary" onClick={removeItem}>
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
      <Grid container>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={props.publishQuest}
          >
            Publish
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

QuestItems.propTypes = {};

export default QuestItems;
