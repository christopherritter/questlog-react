import React from "react";
import mapboxgl from 'mapbox-gl';
import './App.css';
import Signup from "./Signup";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import AddTutorial from "./AddTutorial";
import TutorialsList from "./TutorialsList";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const App = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Link to={"/"} className="navbar-brand" style={{ marginLeft: "1rem" }}>QuestLog</Link>
        <Nav className="mr-auto">
          <Link to={"/tutorials"} className="nav-link">Tutorials</Link>
          <Link to={"/add"} className="nav-link">Add</Link>
        </Nav>
      </Navbar>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route exact path={["/", "/tutorials"]} component={TutorialsList} />
            <Route exact path="/add" component={AddTutorial} />
          </Switch>
        </div>
      </Container>
    </>
  );
};

export default App;
