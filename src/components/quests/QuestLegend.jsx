import React, { useContext } from "react";
import PropTypes from "prop-types";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
  sidebarContent: {
    margin: 16,
    width: "100%",
    maxHeight: "calc(100vh - 120px)",
    // position: "absolute",
    overflowY: "auto",
  },
});

const QuestLegend = props => {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation, locationIndex } =
    useContext(QuestContext);

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Grid container>
          <Grid item sm={11}>
            <Typography className={classes.title} color="textSecondary">
              Legend
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              className={classes.margin}
              onClick={props.toggleLegend}
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <List component="nav">
          {quest.locations &&
            quest.locations.map((loc, index) => {
              return (
                <ListItem
                  button
                  key={loc.id}
                  selected={loc.id === location.id}
                  onClick={() => props.selectLegendItem(loc)}
                >
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {loc.name}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
        </List>
      </CardContent>
    </Card>
  );
}

QuestLegend.propTypes = {};

export default QuestLegend;
