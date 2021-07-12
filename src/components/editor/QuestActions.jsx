import React, { useState, useContext, useRef, useEffect } from "react";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 190,
    overflow: "auto",
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
  },
  actionList: {},
  actionListSubheader: {
    marginLeft: -8,
    marginRight: -8,
  },
  addActionButton: {},
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const QuestActions = (props) => {
  const classes = useStyles();
  const {
    quest,
    addAction,
    updateAction,
    removeAction,
    actionTypes,
    findWithAttr,
  } = useContext(QuestContext);
  var id = 0,
    idList = [0];

  if (quest.actions && quest.actions.length > 0) {
    quest.actions.forEach((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      idList.push(idNumber);
    });

    id = Math.max(...idList) + 1;
  }

  const initialActionState = {
    id: "action-" + id,
    text: "",
    type: "",
    targetId: "",
    effects: [],
  };
  const [action, setAction] = useState(initialActionState);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const actionRef = useRef();

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  function onChangeAction(event) {
    const { name, value } = event.target;
    setAction({ ...action, [name]: value });
  }

  function handleViewAction({ action, index }) {
    setSelectedIndex(index);
    setAction(action);
    setOpen(true);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setSelectedIndex(-1);
    setAction(initialActionState);
    setOpen(false);
  }

  function handleSaveAction() {
    addAction({
      ...action,
    });
    props.addActionToEntry(action.id);
    setSelectedIndex(-1);
    setAction(initialActionState);
    setOpen(false);
  }

  function handleUpdateAction() {
    updateAction({
      ...action,
    });
    setSelectedIndex(-1);
    setAction(initialActionState);
    setOpen(false);
  }

  function handleRemoveAction() {
    removeAction({
      id: action.id,
    });
    props.removeActionFromEntry({
      id: action.id,
    });
    setSelectedIndex(-1);
    setAction(initialActionState);
    setOpen(false);
  }

  function handleSelectType(event) {
    const { value } = event.target;
    var locationIndex = findWithAttr(quest.locations, "id", props.locationId);
    var nextLocationId, previousLocationId;

    if (value === "next") {
      if (locationIndex === quest.locations.length - 1) {
        nextLocationId = quest.locations[0].id;
      } else {
        nextLocationId = quest.locations[locationIndex + 1].id;
      }
      setAction({ ...action, type: value, targetId: nextLocationId });
    } else if (value === "back") {
      if (locationIndex > 0) {
        previousLocationId = quest.locations[locationIndex - 1].id;
      } else {
        previousLocationId = quest.locations[quest.locations.length - 1].id;
      }
      setAction({ ...action, type: value, targetId: previousLocationId });
    } else {
      setAction({ ...action, type: value, targetId: "" });
    }
  }

  const handleChangeEffects = (event) => {
    var { value } = event.target;
    var effects = [];

    for (let i = 0, l = value.length; i < l; i += 1) {
      let index = effects.indexOf(value[i]);
      if (index === -1) {
        effects.push(value[i]);
      } else {
        effects.splice(index, 1);
      }
    }

    setAction({ ...action, effects: effects });
  };

  const switchTarget = (type) => {
    var locationIndex = findWithAttr(quest.locations, "id", action.targetId);
    var nextLocation = quest.locations[locationIndex];
    switch (type) {
      case "look":
        return (
          <Select
            native
            value={action.targetId}
            onChange={handleSelectType}
            inputProps={{
              name: "targetId",
              id: "actionTarget",
            }}
          >
            <option value={undefined}></option>
            {quest.items &&
              quest.items.map((item, index) => {
                return (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                );
              })}
          </Select>
        );
      case "move":
        return (
          <Select
            native
            value={action.targetId}
            onChange={handleSelectType}
            inputProps={{
              name: "targetId",
              id: "actionTarget",
            }}
          >
            <option value={undefined}></option>
            {quest.locations &&
              quest.locations.map((loc, index) => {
                return (
                  <option value={loc.id} key={index}>
                    {loc.name}
                  </option>
                );
              })}
          </Select>
        );
      case "take":
        return (
          <Select
            native
            value={action.targetId}
            onChange={handleSelectType}
            inputProps={{
              name: "targetId",
              id: "actionTarget",
            }}
          >
            <option value={undefined}></option>
            {quest.items &&
              quest.items.map((item, index) => {
                return (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                );
              })}
          </Select>
        );
      case "operate":
        return (
          <Select
            native
            value={action.targetId}
            onChange={handleSelectType}
            inputProps={{
              name: "targetId",
              id: "actionTarget",
            }}
          >
            <option value={undefined}></option>
            {quest.items &&
              quest.items.map((item, index) => {
                return (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                );
              })}
          </Select>
        );
      case "back":
      case "next":
        return (
          <Select native value={action.targetId} disabled>
            <option value={nextLocation.id}>{nextLocation.name}</option>
          </Select>
        );
      default:
        return (
          <Select
            native
            value={action.targetId}
            onChange={handleSelectType}
            inputProps={{
              name: "targetId",
              id: "actionTarget",
            }}
            disabled
          >
            <option value={undefined}></option>
          </Select>
        );
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Action</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            margin="normal"
            id="actionText"
            label="Text"
            type="text"
            name="text"
            fullWidth
            value={action.text}
            onChange={onChangeAction}
          />

          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
          >
            <InputLabel htmlFor="actionType">Type</InputLabel>
            <Select
              native
              value={action.type}
              onChange={handleSelectType}
              inputProps={{
                name: "type",
                id: "actionType",
              }}
            >
              <option value={undefined}></option>
              {actionTypes &&
                actionTypes.map((action, index) => {
                  return (
                    <option value={action.value} key={index}>
                      {action.name}
                    </option>
                  );
                })}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
          >
            <InputLabel htmlFor="actionTarget">Target</InputLabel>
            {switchTarget(action.type)}
          </FormControl>

          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
          >
            <InputLabel id="effects-mutiple-checkbox-label">Effects</InputLabel>
            <Select
              labelId="effects-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={action.effects}
              onChange={handleChangeEffects}
              input={<Input />}
              inputProps={{
                id: "effects-multi-select-label",
              }}
              renderValue={(selected) => selected.join(", ")}
            >
              {quest.objectives.map((objective, index) => (
                <MenuItem key={index} value={objective.id}>
                  <Checkbox
                    checked={action.effects.indexOf(objective.id) > -1}
                  />
                  <ListItemText primary={objective.text} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item>
              <Button onClick={handleRemoveAction}>Remove</Button>
            </Grid>
            <Grid item>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              {selectedIndex > -1 ? (
                <Button onClick={handleUpdateAction} color="primary">
                  Update
                </Button>
              ) : (
                <Button onClick={handleSaveAction} color="primary">
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <Box
        border={1}
        borderRadius={4}
        borderColor={"rgba(255,255,255,0.25)"}
        className={classes.root}
        style={{ marginTop: "1em" }}
      >
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              className={classes.actionListSubheader}
              id="nested-list-subheader"
            >
              Actions
            </ListSubheader>
          }
          className={classes.actionList}
        >
          {quest.actions &&
            quest.actions
              .filter((action) => {
                return props.actions.includes(action.id);
              })
              .map((action, index) => (
                <ListItem
                  button
                  key={index}
                  selected={selectedIndex === action.id}
                  onClick={() => handleViewAction({ action, index })}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" gutterBottom>
                        {action.text}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        style={{ whiteSpace: "pre-line" }}
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {action.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
        </List>

        <Button
          color="secondary"
          variant="contained"
          fullWidth
          className={classes.addActionButton}
          onClick={handleClickOpen}
        >
          Add Action
        </Button>
      </Box>
    </React.Fragment>
  );
};

QuestActions.propTypes = {};

export default QuestActions;
