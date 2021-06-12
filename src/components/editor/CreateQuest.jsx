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
    marginBottom: "1.5em",
    marginBottom: "2em",
  },
  headerButtonBar: {
    marginBottom: "1em",
    marginBottom: "4em",
  },
  headerButtons: {
    marginRight: "1em",
  },
}));

const CreateQuest = (props) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState("");

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

  const [quest, setQuest] = useState(initialQuestState);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = UserDataService.getAll()
      .where("uid", "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setAuthor(doc.data().username));
      });

    return unsubscribe;
  }, [currentUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuest({ ...quest, [name]: value });
  };

  const saveQuest = (e) => {
    e.preventDefault();
    var data = {
      title: quest.title,
      author: author,
      authorId: quest.authorId,
      description: quest.description,
      // categories: quest.categories,
      // image: quest.image,
      isFeatured: false,
      isAnonymous: false,
      // startingPoint: quest.startingPoint,
    };

    QuestDataService.create(data)
      .then((response) => {
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
            <Typography variant="h4">Create Quest</Typography>
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
                value={author}
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
              <Button color="primary" type="submit" onClick={saveQuest}>
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
