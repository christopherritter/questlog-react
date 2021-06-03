import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

function QuestDetails(props) {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h4">
            Create
          </Typography>
        </Grid>
        <Grid item sm={12}>
          <form noValidate>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="questTitle"
              label="Quest Title"
              name="title"
              value={props.quest.title}
              onChange={props.updateDetails}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="questAuthor"
              label="Author"
              name="author"
              value={props.quest.author}
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
              value={props.quest.description}
              onChange={props.updateDetails}
            />
          </form>
        </Grid>
      </Grid>
      <Box className={classes.buttons} display="flex">
        <Button
          variant="contained"
          color="secondary"
          onClick={props.publishQuest}
          className={classes.button}
        >
          Publish
        </Button>
      </Box>
    </>
  );
}

QuestDetails.propTypes = {
  quest: PropTypes.object,
};

export default QuestDetails;
