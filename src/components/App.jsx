import React, { useState, useEffect } from "react";
import {
  Link as RouterLink,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import theme from "./theme.jsx";

import PrivateRoute from "./utils/PrivateRoute.jsx";
// import Home from "./Home.jsx";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import Profile from "./user/Profile.jsx";
import UpdateProfile from "./user/UpdateProfile.jsx";
import QuestLibrary from "./quests/QuestLibrary.jsx";
import CreateQuest from "./editor/CreateQuest.jsx";
// import QuestEditor from "./editor/QuestEditor.jsx";
import Quest from "./quests/Quest.jsx";

import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import CompassOutline from 'mdi-material-ui/CompassOutline'
import DotsVertical from "mdi-material-ui/DotsVertical";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

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
    textDecoration: "none"
  },
}));

const App = () => {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (currentUser) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [currentUser]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    setAnchorEl(null);

    try {
      await logout();
      history.push("/login");
    } catch {
      console.log("Failed to log out");
    }
  }

  const [questId, setQuestId] = React.useState(null)
  const [questTitle, setQuestTitle] = React.useState(null);

  function handleSetQuestId(id) {
    setQuestId(id);
  }

  function handleSetQuestTitle(title) {
    setQuestTitle(title);
  }

  return (
    <ThemeProvider theme={theme}>
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
            <CompassOutline />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            QuestLog
          </Typography>
          {questTitle && (
            <Typography variant="h6" className={classes.title} component={RouterLink} to={`/quest/` + questId}>
              { questTitle }
            </Typography>
          )}
          {loggedIn ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <DotsVertical />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={handleClose}
                  component={RouterLink}
                  to="/profile"
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={RouterLink}
                  to="/create-quest"
                >
                  Create Quest
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main className={classes.root}>
        <Switch>
          <Route exact path="/" component={QuestLibrary} />
          <Route path="/quests" component={QuestLibrary} />
          <Route path="/create-quest" component={CreateQuest} />
          <Route
            exact
            path="/quest/:questId/:role?"
            render={(props) => (
              <Quest {...props} setQuestId={handleSetQuestId} setQuestTitle={handleSetQuestTitle} />
            )}
          />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
        </Switch>
      </main>
    </ThemeProvider>
  );
};

export default App;
