import React from "react";
import "./App.css";

import { Container, Navbar, Nav } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";

import PrivateRoute from "./utils/PrivateRoute.jsx";
import Home from "./Home.jsx";
import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";
import Dashboard from "./user/Dashboard.jsx";
import UpdateProfile from "./user/UpdateProfile.jsx";
import AddTutorial from "./tutorials/AddTutorial.jsx";
import TutorialsList from "./tutorials/TutorialsList.jsx";
import QuestMap from "./quests/QuestMap.jsx";

const App = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Link to={"/"} className="navbar-brand">
            QuestLog
          </Link>
          <Nav className="mr-auto">
            <Link to={"/tutorials"} className="nav-link">
              Tutorials
            </Link>
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
            <Link to={"/quest-map"} className="nav-link">
              Quest Map
            </Link>
          </Nav>
          <Nav>
            <Link to={"/dashboard"} className="nav-link">
              Profile
            </Link>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route exact path={["/", "/tutorials"]} component={TutorialsList} />
          <Route exact path="/add" component={AddTutorial} />
          <Route path="/quest-map" component={QuestMap} />
        </Switch>
      </Container>
    </>
  );
};

export default App;
