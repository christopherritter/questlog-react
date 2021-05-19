import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link, useHistory } from "react-router-dom";
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
    <Container>
      <Card className="mt-5">
        <Card.Body>
          <h2 className="text-center mb-4 mt-2">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Username:</strong> {currentProfile.username} <br />
          <strong>Email:</strong> {currentProfile.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </Container>
  );
};

export default Profile;
