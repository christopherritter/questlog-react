import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
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
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    position: "sticky",
    bottom: "1em",
    zIndex: 1000,
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  topRowButton: {
    marginRight: theme.spacing(1),
    height: "2.90em"
  },
  editorSidebar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
}));

const QuestObjectives = () => {
  const classes = useStyles();
  const { quest, addObjective, updateObjective, removeObjective, publishQuest } =
    useContext(QuestContext);
  var id = 0, idList = [0];

  if (quest.objectives) {
    quest.objectives.forEach((obj) => {
      var idNumber,
        matches = obj.id.match(/\d+$/);
      if (matches) {
        idNumber = matches[0];
      }

      idList.push(idNumber);
    });

    id = Math.max(...idList) + 1;
  }

  const initialObjectiveState = {
    id: "",
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

  const handleAddObjective = (e) => {
    e.preventDefault();
    addObjective({
      id: "objective-" + id,
      text: objective.text,
      isPrimary: objective.isPrimary,
      isComplete: objective.isComplete,
    });
    setObjective(initialObjectiveState);
    setSelectedIndex(-1);
  };

  const handleUpdateObjective = (e) => {
    e.preventDefault();
    updateObjective({
      id: objective.id,
      text: objective.text,
      isPrimary: objective.isPrimary,
      isComplete: objective.isComplete,
    });
    setObjective(initialObjectiveState);
    setSelectedIndex(-1);
  };

  const handleRemoveObjective = (e) => {
    e.preventDefault();
    removeObjective(objective);
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
    <>
      <Grid container>
        <Grid item md={4} sm={12}>
          <Typography variant="h4">Objectives</Typography>
        </Grid>
        <Grid item md={8} sm={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setObjective(initialObjectiveState);
              setSelectedIndex(-1);
            }}
            className={ classes.topRowButton }
          >
            Create New
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.root}>
        <Grid item md={4} sm={12}>
          <form noValidate className={classes.editorSidebar}>
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
          </form>
        </Grid>
        <Grid item md={8} sm={12}>
          <List component="nav">
            {quest.objectives &&
              quest.objectives.map((objective, index) => {
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
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {objective.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })}
          </List>
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
        <Box flexGrow={1}>
          {selectedIndex === -1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddObjective}
              className={classes.button}
            >
              Add Objective
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateObjective}
                className={classes.button}
              >
                Update
              </Button>
              <Button
                variant="contained"
                onClick={handleRemoveObjective}
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

QuestObjectives.propTypes = {};

export default QuestObjectives;
