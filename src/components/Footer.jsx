import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.footer,
  },
  copy: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Paper square elevation="0" className={classes.root}>
      <Container>
        <Typography variant="body1" color="inherit" className={classes.copy}>
          © {new Date().getFullYear()} Christopher Ritter
        </Typography>
      </Container>
    </Paper>
  );
};

export default Footer;
