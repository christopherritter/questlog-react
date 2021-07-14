import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
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
  editorSidebar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
}));

function QuestDetails() {
  const classes = useStyles();
  const { quest, updateDetails, publishQuest } = useContext(QuestContext);

  return (
    <>
      <Grid container>
        <Grid item sm={12}>
          <Typography variant="h4">Create</Typography>
        </Grid>
        <Grid item sm={12}>
          <form noValidate className={classes.editorSidebar}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="questTitle"
              label="Quest Title"
              name="title"
              value={quest.title}
              onChange={updateDetails}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="questAuthor"
              label="Author"
              name="author"
              value={quest.author}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="questDescription"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={quest.description}
              onChange={updateDetails}
            />
          </form>
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
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
    </>
  );
}

export default QuestDetails;
