import React, { useContext } from "react";

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

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
  },
  sidebarContent: {
    // margin: 16,
    width: "100%",
    maxHeight: "calc(100vh - 120px)",
    // position: "absolute",
    overflowY: "auto",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 64px - 56px - 175px)",
    },
  },
}));

const QuestLegend = (props) => {
  const classes = useStyles(props);
  const { viewLocation } = props;
  const { quest, location } = useContext(QuestContext);

  const currentLocations = [...quest.locations];
  const sortedLocations = currentLocations.sort((a, b) =>
    a.order > b.order ? 1 : -1
  );

  function onListItemClick(loc) {
    viewLocation(loc)
  };

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Grid container>
          <Grid item xs={11}>
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
            sortedLocations.map((loc, index) => {
              return (
                <ListItem
                  button
                  key={index}
                  selected={loc.id === location.id}
                  onClick={() => onListItemClick(loc)}
                >
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">{loc.name}</Typography>
                    }
                  />
                </ListItem>
              );
            })}
        </List>
      </CardContent>
    </Card>
  );
};

QuestLegend.propTypes = {};

export default QuestLegend;
