import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.footer,
    marginTop: theme.spacing(12)
  },
  copy: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Paper square elevation="0" className={classes.root}>
      <Container>
        <Typography variant="body2" color="textSecondary" align="center" className={classes.copy}>
          {"Copyright © " + new Date().getFullYear() + " " }
          <Link color="inherit" href="http://www.christopherritter.com/">
            Christopher Ritter
          </Link>
        </Typography>
      </Container>
    </Paper>
  );
};

export default Footer;
