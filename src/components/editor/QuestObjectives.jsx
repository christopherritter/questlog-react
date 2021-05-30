import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CommentIcon from "@material-ui/icons/Comment";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

function QuestObjectives(props) {
  const classes = useStyles();
  var id = 0;

  if (props.objectives) {
    var idList = props.objectives.map((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);

      if (matches) {
        idNumber = matches[0];
      }

      return idNumber;
    });

    id = Math.max(...idList) + 1;
  }

  const initialObjectiveState = {
    id: "objective-" + id,
    text: "",
    isPrimary: false,
    isComplete: false,
  };
  const [objective, setObjective] = useState(initialObjectiveState);

  const onChangeObjective = (event) => {
    const { name, value } = event.target;
    setObjective({ ...objective, [name]: value });
  };
  const onToggleObjective = (event) => {
    const { name, checked } = event.target;
    setObjective({ ...objective, [name]: checked });
  };

  const addObjective = (e) => {
    e.preventDefault();
    props.addObjective({
      id: "objective-" + id,
      text: objective.text,
      isPrimary: objective.isPrimary,
      isComplete: objective.isComplete,
    });
    setObjective(initialObjectiveState);
    setSelectedIndex(-1);
  };

  const updateObjective = (e) => {
    e.preventDefault();
    props.updateObjective({
      id: objective.id,
      text: objective.text,
      isPrimary: objective.isPrimary,
      isComplete: objective.isComplete,
    });
    setObjective(initialObjectiveState);
    setSelectedIndex(-1);
  };

  const removeObjective = (e) => {
    e.preventDefault();
    props.removeObjective(objective);
    setObjective(initialObjectiveState);
    setSelectedIndex(-1);
  };

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleListItemClick = (objective, index) => {
    const selectedObjective = {
      id: objective.id,
      text: objective.text,
      isPrimary: objective.isPrimary,
      isComplete: objective.isComplete,
    };
    setSelectedIndex(index);
    setObjective(selectedObjective);
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item md={4} sm={12}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Typography variant="h4" gutterBottom>
              Objectives
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Button color="primary" onClick={() => {
              setObjective(initialObjectiveState);
              setSelectedIndex(-1);
            }}>
              Create New
            </Button>
          </Grid>
        </Grid>
        <form noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="objectiveText"
            label="Objective"
            name="text"
            value={objective.text}
            onChange={onChangeObjective}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={objective.isPrimary}
                onChange={onToggleObjective}
                name="isPrimary"
              />
            }
            label="Primary Objective"
          />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectedIndex === -1 ? (
                <Button color="primary" onClick={addObjective}>
                  Add Objective
                </Button>
              ) : (
                <>
                  <Button color="primary" onClick={updateObjective}>
                    Update
                  </Button>
                  <Button color="primary" onClick={removeObjective}>
                    Remove
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item md={8} sm={12}>
        <List component="nav">
          {props.objectives &&
            props.objectives.map((objective, index) => {
              return (
                <ListItem
                  button
                  key={objective.id}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(objective, index)}
                >
                  <ListItemIcon>
                    <CommentIcon />
                  </ListItemIcon>
                  <ListItemText primary={
                    <Typography variant="subtitle1">
                      { objective.text }
                    </Typography>
                  } />
                </ListItem>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
}

QuestObjectives.propTypes = {};

export default QuestObjectives;
