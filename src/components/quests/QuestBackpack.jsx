import React, { useContext } from "react";

import QuestContext from "../../contexts/QuestContext.jsx";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
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
import VisibilityIcon from "@material-ui/icons/Visibility";

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

const QuestBackpack = (props) => {
  const theme = useTheme();
  const classes = useStyles(props);
  const { quest, location } = useContext(QuestContext);
  const isMediumAndUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card className={`${classes.sidebarContent}`} elevation={5}>
      <CardContent>
        <Grid container>
          <Grid item xs={11}>
            <Typography className={classes.title} color="textSecondary">
              Backpack
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              className={classes.margin}
              onClick={ props.toggleBackpack }
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>
        <List component="nav">
          {quest.items &&
            quest.items
              .filter((item) => item.isOwned === true)
              .map((i, index) => {
                return (
                  <ListItem
                    button
                    key={index}
                    selected={i.id === location.id}
                    onClick={() => props.selectBackpackItem(i)}
                  >
                    <ListItemIcon>
                      <VisibilityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">{i.name}</Typography>
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

export default QuestBackpack;
