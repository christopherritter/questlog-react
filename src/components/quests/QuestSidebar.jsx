import React, { useContext } from "react";
import PropTypes from "prop-types";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

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
});

function QuestSidebar(props) {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation } =
    useContext(QuestContext);

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Location
        </Typography>
        <Typography variant="h5" component="h2">
          {location.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          {quest.entries &&
            quest.entries
              .filter((entry) => entry.locationId === location.id)
              .map((entry) => entry.text)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

QuestSidebar.propTypes = {};

export default QuestSidebar;
