import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { useAuth } from "../../contexts/AuthContext.jsx";
import UserDataService from "../../services/UserService";

const useStyles = makeStyles((theme) => ({
  card: {
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

const Profile = () => {
  const classes = useStyles();
  const initialProfileState = {
    uid: "",
    username: "",
    email: "",
  };
  const [currentProfile, setCurrentProfile] = useState(initialProfileState);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = UserDataService.getAll()
      .where("uid", "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setCurrentProfile(doc.data()));
      });

    return unsubscribe;
  }, [currentUser]);

  return (
    <Grid>
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">Profile</Typography>
          <strong>Username:</strong> {currentProfile.username} <br />
          <strong>Email:</strong> {currentProfile.email}
          <CardActions>
            <Button component={RouterLink} to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Profile;
