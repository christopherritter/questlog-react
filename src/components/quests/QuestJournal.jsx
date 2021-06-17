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
import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

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

const QuestJournal = (props) => {
  const classes = useStyles(props);
  const { quest, location, updateCenter, selectLocation, locationIndex } =
    useContext(QuestContext);

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Grid container>
          <Grid item xs={11}>
            <Typography className={classes.title} color="textSecondary">
              Journal
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              className={classes.margin}
              onClick={props.toggleJournal}
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <List component="nav">
          {quest.objectives &&
            quest.objectives.filter((obj) => {
              return obj.isPrimary === true;
            }).map((obj) => {
              return (
                <ListItem
                  button
                  key={obj.id}
                  selected={obj.id === location.id}
                  onClick={() => props.selectJournalItem(obj)}
                >
                  <ListItemIcon>
                    { obj.isComplete ? <CheckBox /> : <CheckBoxOutlineBlankIcon /> }
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">{obj.text}</Typography>
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

QuestJournal.propTypes = {};

export default QuestJournal;
