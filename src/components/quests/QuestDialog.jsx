import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheckBox from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import WalkIcon from "mdi-material-ui/Walk";
import BackpackIcon from "mdi-material-ui/BagPersonal";
import HandPointingIcon from "mdi-material-ui/HandPointingRight";
import EyeIcon from "mdi-material-ui/Eye";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogQuestActions = withStyles(styles)(
  ({
    quest,
    item,
    viewQuestItem,
    selectLocation,
    takeQuestItem,
    operateQuestItem,
  }) => {
    const localActions = item.actions.map((actionId) => {
      const actionIndex = findWithAttr(quest.actions, "id", actionId);
      const action = quest.actions[actionIndex];

      return action;
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
        {localActions.map((action, index) => (
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
  }
);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function toggleView({
  quest,
  location,
  item,
  open,
  onClose,
  restartQuest,
  dialogType,
  operateQuestItem,
  viewQuestItem,
  selectLocation,
  takeQuestItem,
  findWithAttr,
}) {
  if (item && dialogType) {
    switch (dialogType) {
      case "item":
        return (
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="item-dialog-title"
            aria-describedby="item-dialog-description"
          >
            <DialogTitle id="item-dialog-title" onClose={onClose}>
              {item.name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="item-dialog-description">
                {item.description}
              </DialogContentText>
              <DialogQuestActions
                quest={quest}
                item={item}
                viewQuestItem={viewQuestItem}
                selectLocation={selectLocation}
                takeQuestItem={takeQuestItem}
                operateQuestItem={operateQuestItem}
                findWithAttr={findWithAttr}
              />
            </DialogContent>
          </Dialog>
        );
      default:
        return (
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="invalid-dialog-title"
            aria-describedby="invalid-dialog-description"
          >
            <DialogTitle id="invalid-dialog-title">
              {"Action type not recognized"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="invalid-dialog-description">
                That is not a valid action type.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Close dialog
              </Button>
            </DialogActions>
          </Dialog>
        );
    }
  } else {
    var questComplete = true;

    if (quest.objectives) {
      quest.objectives
        .filter((objective) => objective.isPrimary === true)
        .forEach((objective) => {
          if (objective.isComplete === false) questComplete = false;
        });
    }

    if (questComplete !== true) {
      return (
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="quest-dialog-title"
          aria-describedby="quest-dialog-description"
        >
          <DialogTitle id="quest-dialog-title">{"Objectives"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="quest-dialog-description">
              Complete these objectives to finish the quest.
            </DialogContentText>
            <List component="nav">
              {quest.objectives &&
                quest.objectives
                  .filter((obj) => {
                    return obj.isPrimary === true;
                  })
                  .map((obj) => {
                    return (
                      <ListItem
                        button
                        key={obj.id}
                        selected={obj.id === location.id}
                      >
                        <ListItemIcon>
                          {obj.isComplete ? (
                            <CheckBox />
                          ) : (
                            <CheckBoxOutlineBlankIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {obj.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Keep Playing
            </Button>
            <Button onClick={restartQuest} color="primary" autoFocus>
              Restart Quest
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return (
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Quest complete!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have finished all of the objectives and completed the quest.
              Would you like to start the quest over and play it again?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Keep Playing
            </Button>
            <Button onClick={restartQuest} color="primary" autoFocus>
              Restart Quest
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
}

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

function QuestDialog(props) {
  const {
    quest,
    location,
    item,
    open,
    onClose,
    restartQuest,
    dialogType,
    operateQuestItem,
    viewQuestItem,
    selectLocation,
    takeQuestItem,
    findWithAttr,
  } = props;

  return toggleView({
    quest,
    location,
    item,
    open,
    onClose,
    restartQuest,
    dialogType,
    operateQuestItem,
    viewQuestItem,
    selectLocation,
    takeQuestItem,
    findWithAttr,
  });
}

export default QuestDialog;