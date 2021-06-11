import React from 'react'

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

function QuestDialog(props) {
  const classes = useStyles();
  const { open, onClose, restartQuest } = props;

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
          Congradulations you have accomplished all of the objects and completed
          the quest. Would you like to start the quest over and play it again?
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

export default QuestDialog;