import React from "react";
import "./App.css";
import { Link as RouterLink, Switch, Route } from "react-router-dom";

import PrivateRoute from "./utils/PrivateRoute.jsx";
// import Home from "./Home.jsx";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import Profile from "./user/Profile.jsx";
import UpdateProfile from "./user/UpdateProfile.jsx";
import QuestsList from "./quests/QuestsList.jsx";
import QuestEditor from "./quests/QuestEditor.jsx";
import Quest from "./quests/Quest.jsx";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import ExploreIcon from '@material-ui/icons/Explore';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    position: "relative",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <AppBar color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            component={RouterLink}
            to="/"
          >
            <ExploreIcon />
          </IconButton>
          <Typography color="white" variant="h6" className={classes.title}>
            QuestLog
          </Typography>
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Switch>
          <Route exact path="/" component={QuestsList} />
          <Route path="/quests" component={QuestsList} />
          <Route exact path="/quest-editor/" component={QuestEditor} />
          <Route exact path="/quest/:id" component={Quest} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
        </Switch>
      </main>
    </>
  );
};

export default App;
