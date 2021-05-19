import React from "react";
import "./App.css";

import { Container, Navbar, Nav } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";

import PrivateRoute from "./utils/PrivateRoute.jsx";
import Home from "./Home.jsx";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import Profile from "./user/Profile.jsx";
import UpdateProfile from "./user/UpdateProfile.jsx";
import AddTutorial from "./tutorials/AddTutorial.jsx";
import TutorialsList from "./tutorials/TutorialsList.jsx";
import QuestsList from "./quests/QuestsList.jsx";
import QuestEditor from "./quests/QuestEditor.jsx";
import Quest from "./quests/Quest.jsx";

const App = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Link to={"/"} className="navbar-brand">
            QuestLog
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="mr-auto">
              <Link to={"/tutorials"} className="nav-link">
                Tutorials
              </Link>
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
              <Link to={"/quests"} className="nav-link">
                Quests List
              </Link>
              <Link to={"/editor"} className="nav-link">
                Quest Editor
              </Link>
            </Nav>
            <Nav>
              <Link to={"/profile"} className="nav-link">
                Profile
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path={["/", "/tutorials"]} component={TutorialsList} />
          <Route exact path="/add-tutorial" component={AddTutorial} />
          <Route path="/quests" component={QuestsList} />
          <Route path="/editor" component={QuestEditor} />
          <Route path="/quest" component={Quest} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
        </Switch>
      </Container>
    </>
  );
};

export default App;
