import React, { useContext } from "react";
import PropTypes from "prop-types";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import WalkIcon from "mdi-material-ui/Walk";
import BackpackIcon from "mdi-material-ui/BagPersonal";
import DoorOpenIcon from "mdi-material-ui/DoorOpen";
import EyeIcon from "mdi-material-ui/Eye";

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  sidebarContent: {
    margin: 16,
    width: "100%",
    maxHeight: "calc(100vh - 120px)",
    // position: "absolute",
    overflowY: "auto",
  },
});

const switchIcon = (type) => {
  switch (type) {
    case "move":
      return <WalkIcon />;
    case "take":
      return <BackpackIcon />;
    case "open":
      return <DoorOpenIcon />;
    case "look":
      return <EyeIcon />;
  }
};

const QuestActions = ({
  quest,
  location,
  selectLocation,
  selectMoveAction,
}) => {
  const localEntries = quest.entries.filter(
    (entry) => entry.locationId === location.id
  );
  var localActions = [];

  localEntries.forEach((entry) => {
    entry.actions.map((action) => localActions.push(action));
  });

  function selectAction(event) {
    const actionIndex = findWithAttr(quest.actions, "id", event.target.id);
    const action = quest.actions[actionIndex];

    switch (action.type) {
      case "move":
        const locationIndex = findWithAttr(
          quest.locations,
          "id",
          action.targetId
        );
        selectLocation(action.targetId);
        selectMoveAction(quest.locations[locationIndex]);
        return console.log("Move");
      case "take":
        return console.log("Take");
      case "open":
        return console.log("Open");
      case "look":
        return console.log("Look");
    }
  }

  function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  return (
    <List component="nav" aria-label="location actions">
      {quest.actions
        .filter((result) => {
          return localActions.includes(result.id);
        })
        .map((action, index) => (
          <ListItem button key={index} onClick={selectAction}>
            <ListItemIcon>{switchIcon(action.type)}</ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  id={action.id}
                  christopher="ritter"
                >
                  {action.text}
                </Typography>
              }
            />
          </ListItem>
        ))}
    </List>
  );
};

const QuestSidebar = (props) => {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation } =
    useContext(QuestContext);

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Location
        </Typography>
        <Typography variant="h5" component="h2">
          {location.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          {quest.entries &&
            quest.entries
              .filter((entry) => entry.locationId === location.id)
              .map((entry) => entry.text)}
        </Typography>
      </CardContent>
      {quest.actions && (
        <QuestActions
          quest={quest}
          location={location}
          selectLocation={selectLocation}
          selectMoveAction={props.selectMoveAction}
        />
      )}
    </Card>
  );
};

QuestSidebar.propTypes = {};

export default QuestSidebar;
