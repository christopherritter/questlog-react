import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";

import QuestDataService from "../../services/QuestService";
import Footer from "./../Footer.jsx";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Link from "@material-ui/core/Link";

const Quests = () => {
  const [quests, loading, error] = useCollection(
    QuestDataService.getAll().orderBy("title", "asc")
  );

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <h1>Quests</h1>
        </Grid>
        <Grid item xs={12}>
          {error && <strong>Error: {error}</strong>}
          {loading && <span>Loading...</span>}
          {!loading &&
            quests &&
            quests.docs.map((quest, index) => (
              <Card style={{ width: "18rem" }} key={index}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {quest.data().title}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {quest.data().description}
                  </Typography>
                  <CardActions>
                    <Link
                      component={RouterLink}
                      to={`/quest/${quest.data().questId}`}
                      className="btn btn-primary"
                    >
                      View Quest
                    </Link>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Quests;
