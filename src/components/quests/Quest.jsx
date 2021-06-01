import React, { useState, useEffect } from "react";
import QuestDataService from "../../services/QuestService";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
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
    marginBottom: "1.5em",
    marginBottom: "2em",
  },
  headerButtonBar: {
    marginBottom: "1em",
    marginBottom: "4em",
  },
  headerButtons: {
    marginRight: "1em",
  }
}));

const Quest = (props) => {
  const classes = useStyles();

  const initialQuestState = {
    author: "",
    authorId: "",
    categories: [],
    description: "",
    featured: false,
    image: "",
    isAnonymous: false,
    isFeatured: false,
    questId: "",
    startingPoint: "",
    title: "",
  };
  const initialRegionState = {
    latitude: 39.82835,
    longitude: -98.5816737,
    name: "Geographic Center of the United States",
    zoom: 12.5,
  };

  const [quest, setQuest] = useState(initialQuestState);
  const [currentRegion, setCurrentRegion] = useState(initialRegionState);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(props);
    const unsubscribe = QuestDataService.getAll()
      .where("questId", "==", props.match.params.questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setQuest(doc.data()));
      });

    return unsubscribe;
  }, [props]);

  return (
    <Paper elevation={0} className={classes.root} square >
      <Container>
        <Grid container>
          <Grid sm={12} item>
            <Typography variant="h2" gutterBottom className={ classes.headerTitle }>{quest.title}</Typography>
            <Typography variant="subtitle1" className={ classes.headerText }>{quest.description}</Typography>
            <Box className={classes.headerButtonBar}>
              <Button variant="contained" className={classes.headerButtons} color="primary">Play</Button>
              <Button variant="contained" className={classes.headerButtons}>Read</Button>
              <Button variant="contained" className={classes.headerButtons}>Edit</Button>
            </Box>
          </Grid>
          <Grid sm={12} item>

          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default Quest;
