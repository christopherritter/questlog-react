import React, { useContext } from 'react'
import PropTypes from 'prop-types'

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
import VisibilityIcon from '@material-ui/icons/Visibility';

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

const QuestBackpack = props => {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation, locationIndex } =
    useContext(QuestContext);

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Grid container>
          <Grid item sm={11}>
            <Typography className={classes.title} color="textSecondary">
              Backpack
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              className={classes.margin}
              onClick={props.toggleBackpack}
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <List component="nav">
          {quest.items &&
            quest.items.map((i, index) => {
              return (
                <ListItem
                  button
                  key={i.id}
                  selected={i.id === location.id}
                  onClick={() => props.selectBackpackItem(i)}
                >
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {i.name}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
        </List>
      </CardContent>
    </Card>
  )
}

QuestBackpack.propTypes = {

}

export default QuestBackpack
