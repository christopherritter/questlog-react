import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

import QuestContext from "../../contexts/QuestContext.jsx";
import QuestMap from "./QuestMap.jsx";
import Footer from "../Footer.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  headerTitle: {
    marginTop: "1.5em",
  },
  headerText: {
    marginTop: "1.5em",
    marginBottom: "2em",
  },
  headerButtonBar: {
    marginTop: "1em",
    marginBottom: "4em",
  },
  headerButtons: {
    marginRight: "1em",
  },
}));

const QuestViewer = () => {
  const classes = useStyles();
  const { quest } = useContext(QuestContext);
  const { currentUser } = useAuth();

  return (
    <>
      <Paper elevation={0} className={classes.root} square>
        {quest.image.length > 0 && (
          <img
            src={
              "https://questlog-images.s3.us-east-2.amazonaws.com/" +
              quest.image
            }
            alt="Cover art"
            width="100%"
          />
        )}
        <Container>
          <Grid container spacing={0}>
            <Grid sm={12} item>
              <Typography
                variant="h2"
                gutterBottom
                className={classes.headerTitle}
              >
                {quest.title}
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                style={{ whiteSpace: "pre-line" }}
                paragraph
                className={classes.headerText}
              >
                {quest.description}
              </Typography>
              <Box className={classes.headerButtonBar}>
                <Button
                  variant="contained"
                  className={classes.headerButtons}
                  color="primary"
                  component={RouterLink}
                  to={"/quest/" + quest.questId + "/play"}
                >
                  Play
                </Button>
                <Button
                  variant="contained"
                  className={classes.headerButtons}
                  component={RouterLink}
                  to={"/quest/" + quest.questId + "/read"}
                >
                  Read
                </Button>
                {currentUser && currentUser.uid === quest.authorId && (
                  <Button
                    variant="contained"
                    className={classes.headerButtons}
                    component={RouterLink}
                    to={"/quest/" + quest.questId + "/edit"}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid sm={12} item></Grid>
          </Grid>
        </Container>
        {quest.region && (
          <QuestMap quest={quest} width={"100%"} height={"400px"} />
        )}
      </Paper>
      <Footer />
    </>
  );
};

export default QuestViewer;
