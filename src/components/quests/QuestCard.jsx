import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
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

function truncate(input) {
  if (input.length > 300) {
     return input.substring(0, 300) + '...';
  }
  return input;
};

const QuestCard = ({ quest }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {quest.data().title}
        </Typography>
        <Typography variant="body2" component="p">
          { truncate(quest.data().description) }
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
  );
};

export default QuestCard;
