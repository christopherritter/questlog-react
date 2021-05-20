import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link as RouterLink, useHistory } from "react-router-dom";
import UserDataService from "../../services/UserService";

const Profile = () => {
  const initialProfileState = {
    uid: "",
    username: "",
    email: "",
  };
  const [currentProfile, setCurrentProfile] = useState(initialProfileState);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = UserDataService.getAll()
      .where("uid", "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setCurrentProfile(doc.data()));
      });

    return unsubscribe;
  }, [currentUser]);

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <Grid>
      <Card className="mt-5">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">Profile</Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Username:</strong> {currentProfile.username} <br />
          <strong>Email:</strong> {currentProfile.email}
          <CardActions>
            <Link component={RouterLink} to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </CardActions>
        </CardContent>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </Grid>
  );
};

export default Profile;
