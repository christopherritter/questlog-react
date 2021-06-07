import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
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
  var id = 0;

  if (props.actions && props.actions.length > 0) {
    var idList = props.actions.map((obj) => {
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

  useEffect(() => {
    if (props.action) {
      setAction(props.action);
    }
  }, [props.action]);

  function onChangeAction(event) {
    const { name, value } = event.target;
    setAction({ ...action, [name]: value });
  };

  const [open, setOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = useState(false);

  function handleListItemClick() {
    console.log("Quest item click")
  };

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  };

  function handleSaveAction() {
    console.log("Handle save action");
    props.addAction({
      id: "action-" + id,
      ...action,
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveAction} color="primary">
            Save
          </Button>
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



        {props.actions &&
          props.actions
            .map((action, index) => (
              <ListItem
                button
                key={action.id}
                selected={selectedIndex === action.id}
                onClick={() => handleListItemClick(action, action.id)}
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




        {/* <ListItem button>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Sent mail" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem> */}




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
