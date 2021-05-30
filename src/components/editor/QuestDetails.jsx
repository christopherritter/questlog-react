import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

function QuestDetails(props) {
  return (
    <Grid container spacing={2}>
      <Grid item sm={12}>
        <form noValidate>
          <Typography variant="h4" gutterBottom>
            Quest
          </Typography>
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
  );
}

QuestDetails.propTypes = {
  quest: PropTypes.object,
};

export default QuestDetails;
