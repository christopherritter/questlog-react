import React, { useRef, useState } from "react";

import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link as RouterLink, useHistory } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Link from '@material-ui/core/Link';

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.currentValue) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">Update Profile</Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              ref={emailRef}
              defaultValue={currentUser.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              ref={passwordRef}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="passwordConfirm"
              label="Password Confirmation"
              type="password"
              id="passwordConfirm"
              autoComplete="confirm-password"
              ref={passwordConfirmRef}
            />
            <CardActions>
              <Button className="w-100" type="submit" disabled={loading}>
                Update
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link component={RouterLink} to="/">Cancel</Link>
      </div>
    </>
  );
}
