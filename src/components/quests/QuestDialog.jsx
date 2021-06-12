import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheckBox from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
  },
}));

function toggleView({
  quest,
  location,
  item,
  open,
  onClose,
  restartQuest,
  dialogType,
}) {
  if (item && dialogType) {
    console.log(dialogType);

    switch (dialogType) {
      case "item":
        return (
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="unknown-dialog-title"
            aria-describedby="unknown-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { item.name }
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { item.description }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Close dialog
              </Button>
              <Button onClick={onClose} color="primary">
                Use item
              </Button>
            </DialogActions>
          </Dialog>
        );
      default:
        return (
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="unknown-dialog-title"
            aria-describedby="unknown-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Action type not recognized"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
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
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Objectives"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
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

function QuestDialog(props) {
  const { quest, location, item, open, onClose, restartQuest, dialogType } = props;

  return toggleView({
    quest,
    location,
    item,
    open,
    onClose,
    restartQuest,
    dialogType,
  });
}

export default QuestDialog;
