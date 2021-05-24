import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
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

  if (props.objectives.length > 0) {
    // need to detect max id number
    id = props.objectives.length;
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
    props.updateObjectives({
      id: "objective-" + id,
      text: objective.text,
      isPrimary: objective.isPrimary,
      isComplete: objective.isComplete,
    });
    setObjective(initialObjectiveState);
  };

  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={4}>
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
              <Checkbox checked={objective.isPrimary} onChange={onToggleObjective} name="isPrimary" />
            }
            label="Primary Objective"
          />

          <Button color="primary" onClick={addObjective}>
            Add Objective
          </Button>
        </form>
      </Grid>
      <Grid item md={8}>
        <List className={classes.root}>
          {props.objectives.map((objective, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <ListItem
                key={index}
                role={undefined}
                dense
                button
                onClick={handleToggle(index)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(index) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={objective.text} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments">
                    <CommentIcon />
                  </IconButton>
                </ListItemSecondaryAction>
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
