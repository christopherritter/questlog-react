import React, { useRef, useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { useAuth } from "../../contexts/AuthContext.jsx";
import UserDataService from "../../services/UserService";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Link from '@material-ui/core/Link';

const Signup = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    // const [uid, setUid] = useState();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }

    setError("");
    setLoading(true);

    try {
      await signup(emailRef.current.value, passwordRef.current.value).then(
        (result) => {
          const data = {
            username: usernameRef.current.value,
            email: result.user.email,
            uid: result.user.uid,
          };
          UserDataService.create(data)
            .then(() => {
              history.push("/dashboard");
            })
            .catch((e) => {
              console.log(e);
            });
        }
      );
    } catch {
      setError("Failed to create account");
    }

    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">Sign Up</Typography>
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
                autoFocus
                ref={usernameRef}
              />
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
                autoComplete="comfirm-password"
                ref={passwordConfirmRef}
              />
              <CardActions>
                <Button className="w-100" type="submit" disabled={loading}>
                  Sign Up
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link component={RouterLink} to="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
