import React, { useContext } from "react";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "mdi-material-ui/Close";
import WalkIcon from "mdi-material-ui/Walk";
import BackpackIcon from "mdi-material-ui/BagPersonal";
import HandPointingIcon from "mdi-material-ui/HandPointingRight";
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
  entries: {
    paddingBottom: "0.75em",
    "&:last-child": {
      paddingBottom: 0,
    },
  },
});

const switchIcon = (type) => {
  switch (type) {
    case "look":
      return <EyeIcon />;
    case "move":
      return <WalkIcon />;
    case "take":
      return <BackpackIcon />;
    case "operate":
      return <HandPointingIcon />;
    default:
      return;
  }
};

const QuestActions = ({
  quest,
  location,
  selectLocation,
  viewQuestItem,
  takeQuestItem,
  operateQuestItem,
}) => {
  const localEntries = quest.entries.filter(
    (entry) => entry.locationId === location.id
  );
  var localActions = [];

  const filteredEntries = localEntries.filter((entry) => {
    if (entry.requirements && entry.requirements.length > 0) {
      let required = true;

      entry.requirements.map((objId) => {
        let i = findWithAttr(quest.objectives, "id", objId);
        return (required = quest.objectives[i].isComplete);
      });

      if (required) return entry;
    } else if (entry.expirations && entry.expirations.length > 0) {
      let expired = true;

      entry.expirations.map((objId) => {
        let i = findWithAttr(quest.objectives, "id", objId);
        return (expired = quest.objectives[i].isComplete);
      });

      if (!expired) return entry;
    } else {
      return entry;
    }
  });

  filteredEntries.forEach((entry) => {
    entry.actions.map((action) => localActions.push(action));
  });

  const filteredActions = localActions.filter((action) => {
    const actionIndex = findWithAttr(quest.actions, "id", action);
    const selectedAction = quest.actions[actionIndex];

    if (selectedAction && selectedAction.type === "take") {
      const targetIndex = findWithAttr(
        quest.items,
        "id",
        selectedAction.targetId
      );
      const targetItem = quest.items[targetIndex];

      if (!targetItem.isOwned) {
        return action;
      }
    } else {
      return action;
    }
  });

  function selectAction(event) {
    const actionIndex = findWithAttr(quest.actions, "id", event.target.id);
    const action = quest.actions[actionIndex];

    if (action.type) {
      switch (action.type) {
        case "look":
          return viewQuestItem(action.targetId);
        case "move":
          return selectLocation(action.targetId);
        case "take":
          return takeQuestItem(action);
        case "operate":
          return operateQuestItem(action);
        default:
          return;
      }
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
          return filteredActions.includes(result.id);
        })
        .map((action, index) => (
          <ListItem button key={index} onClick={selectAction}>
            <ListItemIcon>{switchIcon(action.type)}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1" id={action.id}>
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
  const {
    quest,
    location,
    selectLocation,
    viewQuestItem,
    takeQuestItem,
    operateQuestItem,
    findWithAttr,
  } = useContext(QuestContext);

  const localEntries = quest.entries.filter(
    (entry) => entry.locationId === location.id
  );

  const filteredEntries = localEntries.filter((entry) => {
    if (entry.requirements && entry.requirements.length > 0) {
      for (let i = 0; i < entry.requirements.length; i++) {
        const objectiveIndex = findWithAttr(
          quest.objectives,
          "id",
          entry.requirements[i]
        );

        if (quest.objectives[objectiveIndex].isComplete === true) {
          return entry;
        }
      }
    } else if (entry.expirations && entry.expirations.length > 0) {
      for (let i = 0; i < entry.expirations.length; i++) {
        const objectiveIndex = findWithAttr(
          quest.objectives,
          "id",
          entry.expirations[i]
        );

        if (quest.objectives[objectiveIndex].isComplete !== true) {
          return entry;
        }
      }
    } else {
      return entry;
    }
  });

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Grid container>
          <Grid item sm={11}>
            <Typography className={classes.title} color="textSecondary">
              Location
            </Typography>
          </Grid>
          <Grid item sm={1}>
            <IconButton
              aria-label="delete"
              className={classes.margin}
              onClick={props.toggleSidebar}
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="h5" component="h2" gutterBottom>
          {location.name}
        </Typography>
        {filteredEntries &&
          filteredEntries.map((entry, index) => (
            <Typography
              variant="body2"
              component="p"
              className={classes.entries}
              key={index}
            >
              {entry.text}
            </Typography>
          ))}
      </CardContent>
      {quest.actions && (
        <QuestActions
          quest={quest}
          location={location}
          selectLocation={selectLocation}
          viewQuestItem={viewQuestItem}
          takeQuestItem={takeQuestItem}
          operateQuestItem={operateQuestItem}
        />
      )}
    </Card>
  );
};

export default QuestSidebar;
