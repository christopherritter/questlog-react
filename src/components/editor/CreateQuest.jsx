import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import UserDataService from "../../services/UserService";
import QuestDataService from "../../services/QuestService";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
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
  actionButton: {
    marginTop: "1em"
  }
}));

const CreateQuest = (props) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  // const [author, setAuthor] = useState("");

  const initialQuestState = {
    questId: "",
    title: "",
    author: "",
    authorId: "",
    description: "",
    categories: [],
    region: {
      latitude: 0,
      longitude: 0,
      bearing: 0,
      pitch: 0,
      zoom: 0,
    },
    objectives: [],
    locations: [],
    entries: [],
    items: [],
    actions: [],
    image: "",
    isAnonymous: false,
    isFeatured: false,
  };

  const [quest, setQuest] = useState(initialQuestState);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = UserDataService.getAll()
      .where("uid", "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setQuest({ ...quest, author: doc.data().username, authorId: currentUser.uid }));
      });

    return unsubscribe;
  }, [currentUser, quest]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuest({ ...quest, [name]: value });
  };

  const saveQuest = (e) => {
    e.preventDefault();
    var data = { ...quest };

    QuestDataService.create(data)
      .then((response) => {
        console.log("response id " + response.id)
        QuestDataService.update(response.id, { questId: response.id });
        history.push("/quest/" + response.id + "/edit");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const newQuest = () => {
  //   setQuest(initialQuestState);
  // };

  return (
    <Paper elevation={0} className={classes.root} square>
      <Container>
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <Typography variant="h4" className={classes.headerTitle}>Create Quest</Typography>
          </Grid>
          <Grid item sm={12}>
            <form noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="questTitle"
                label="Quest Title"
                name="title"
                value={quest.title}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="questAuthor"
                label="Author"
                name="author"
                value={quest.author}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="questDescription"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={quest.description}
                onChange={handleInputChange}
              />
              <Button color="primary" className={classes.actionButton} variant="contained" type="submit" onClick={saveQuest}>
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default CreateQuest;
