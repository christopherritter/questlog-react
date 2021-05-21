import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

function QuestDetails(props) {

  const initialDetailsState = {
    questId: "",
    title: "",
    author: "",
    authorId: "",
    description: "",
    categories: "",
    image: "",
    startingPoint: "",
  };
  const [details, setDetails] = useState(initialDetailsState);

  useEffect(() => {
    const setInitialDetails = setDetails(props.quest)
    return setInitialDetails;
  }, [props.quest])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDetails({ ...details, [name]: value });
  };

  return (
    <Grid>
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
  );
}

QuestDetails.propTypes = {
  quest: PropTypes.object,
};

export default QuestDetails;
