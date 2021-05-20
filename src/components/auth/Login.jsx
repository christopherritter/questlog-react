import React, { useRef, useState } from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Link from '@material-ui/core/Link';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center bg-dark"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">Log In</Typography>
            {error && <Alert severity="error">{error}</Alert>}
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
                inputRef={emailRef}
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
                inputRef={passwordRef}
              />
              <CardActions>
                <Button className="w-100" type="submit" disabled={loading}>
                  Log In
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link component={RouterLink} to="/signup">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
}
