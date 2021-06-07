import React, { useState, useEffect, useContext } from "react";

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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
}));

const QuestActions = (props) => {
  const classes = useStyles();
  const {
    quest,
    actionIndex,
    addAction,
    updateAction,
    clearAction,
    removeAction,
    publishQuest,
  } = useContext(QuestContext);
  var id = 0;

  if (quest.actions && quest.actions.length > 0) {
    var idList = quest.actions.map((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      return idNumber;
    });

    id = Math.max(...idList) + 1;
  }

  const initialActionState = {
    id: "action-" + id,
    text: "",
    targetId: "",
    type: "" ,
    marker: "",
  };

  const [action, setAction ] = useState(initialActionState);

  // useEffect(() => {
  //   if (props.action) {
  //     setAction(props.action);
  //   }
  // }, [props.action]);

  function onChangeAction(event) {
    const { name, value } = event.target;
    setAction({ ...action, [name]: value });
  };

  const [open, setOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = useState(false);

  function handleViewAction(event) {
    setAction(event)
    setOpen(true);
  };

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setAction(initialActionState);
    setOpen(false);
  };

  function handleSaveAction() {
    addAction({
      id: "action-" + id,
      ...action,
    });
    props.addActionToEntry("action-" + id);
    setAction(initialActionState);
    setOpen(false);
  };

  function handleRemoveAction() {
    removeAction({
      id: action.id,
    });
    props.removeActionFromEntry({
      id: action.id,
    });
    setAction(initialActionState);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Action</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            id="actionText"
            label="Action"
            type="text"
            name="text"
            fullWidth
            value={action.title}
            onChange={onChangeAction}
          />
          <TextField
            margin="normal"
            id="actionMarker"
            label="Marker"
            type="text"
            name="marker"
            fullWidth
            value={action.marker}
            onChange={onChangeAction}
          />
          <TextField
            margin="normal"
            id="actionTarget"
            label="Target"
            type="text"
            name="targetId"
            fullWidth
            value={action.targetId}
            onChange={onChangeAction}
          />
          <TextField
            margin="normal"
            id="actionType"
            label="Type"
            type="text"
            name="type"
            fullWidth
            value={action.type}
            onChange={onChangeAction}
          />
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item>
            <Button onClick={handleRemoveAction}>
            Remove
          </Button>
            </Grid>
            <Grid item>
            <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAction} color="primary">
            Save
          </Button>
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
              return props.actions.includes(action.id)
            })
            .map((action, index) => (
              <ListItem
                button
                key={index}
                selected={selectedIndex === action.id}
                onClick={() => handleViewAction(action, action.id)}
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
