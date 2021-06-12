import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";

import QuestDataService from "../services/QuestService";
import Footer from "./Footer.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import CompassOutlineIcon from "mdi-material-ui/CompassOutline";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  jumboContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    marginBottom: theme.spacing(6)
  },
  jumboIcon: {
    fontSize: 60,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(-1),
  },
  jumboButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const Jumbotron = () => {
  const classes = useStyles();

  return (
    <div className={classes.jumboContent}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
          className={classes.jumboTitle}
        >
          {/* <CompassOutlineIcon className={classes.jumboIcon} /> */}
          QuestLog
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          A storytelling platform for playing text-based adventures on an
          interactive map.
        </Typography>
        {/* <div className={classes.jumboButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button variant="contained" color="primary">
                Main call to action
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary">
                Secondary action
              </Button>
            </Grid>
          </Grid>
        </div> */}
      </Container>
    </div>
  );
};

const Home = () => {
  const classes = useStyles();
  const [quests, loading, error] = useCollection(
    QuestDataService.getAll().orderBy("title", "asc")
  );

  return (
    <>
      <Container className={classes.cardGrid} maxWidth="md">
        <Jumbotron />
        <Grid container spacing={4}>
          {error && <strong>Error: {error}</strong>}
          {loading && <span>Loading...</span>}
          {!loading &&
            quests &&
            quests.docs.map((quest, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card} key={index}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {quest.data().title}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {quest.data().description}
                    </Typography>
                    <CardActions>
                      <Button
                        color="primary"
                        component={RouterLink}
                        to={`/quest/${quest.data().questId}`}
                        className="btn btn-primary"
                      >
                        View Quest
                      </Button>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
