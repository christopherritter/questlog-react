import React from 'react'
import PropTypes from 'prop-types'

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const QuestRegion = props => {

  const onUpdateCenter = (event) => {
    props.updateCenter(event.coordinates);
  };

  const map = React.cloneElement(props.map, { updateCenter: onUpdateCenter });

  return (
    <Grid container spacing={4}>
      <Grid item sm={3}>
      <form noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="regionCoords"
          label="Coordinates"
          name="coordinates"
          value={props.region.coordinates}
          onChange={props.updateRegion}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="regionName"
          label="Name"
          name="name"
          value={props.region.name}
          onChange={props.updateRegion}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="regionZoom"
          label="Zoom"
          name="zoom"
          value={props.region.zoom}
          onChange={props.updateRegion}
        />
      </form>
      </Grid>
      <Grid item sm={9}>
        { map }
      </Grid>
    </Grid>
  );
}

QuestRegion.propTypes = {
  region: PropTypes.object,
}

export default QuestRegion
