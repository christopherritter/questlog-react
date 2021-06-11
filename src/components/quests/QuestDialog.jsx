import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
  },
}));

function toggleView({ quest, open, onClose, restartQuest, type }) {
  if (type) {
    switch (type) {
      default:
        return (
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="unknown-dialog-title"
            aria-describedby="unknown-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Type not recognized"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                That is not a valid dialog type.
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
  const { quest, open, onClose, restartQuest } = props;

  return toggleView({ quest, open, onClose, restartQuest });
}

export default QuestDialog;
