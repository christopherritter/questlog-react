import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link as RouterLink } from "react-router-dom";
import UserDataService from "../../services/UserService";

const Profile = () => {
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
      <Card className="mt-5">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">Profile</Typography>
          <strong>Username:</strong> {currentProfile.username} <br />
          <strong>Email:</strong> {currentProfile.email}
          <CardActions>
            <Link component={RouterLink} to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </CardActions>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Profile;
