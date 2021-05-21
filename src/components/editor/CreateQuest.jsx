import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { useAuth } from "../../contexts/AuthContext.jsx";
import UserDataService from "../../services/UserService";
import QuestDataService from "../../services/QuestService";

const CreateQuest = (props) => {
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState("");

  const initialQuestState = {
    title: "",
    authorId: currentUser.uid,
    description: "",
    categories: [],
    image: "",
    startingPoint: "",
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

  // useEffect(() => {
  //   if (props.match.params.questId) {
  //     const unsubscribe = QuestDataService.getAll()
  //       .where("questId", "==", props.match.params.questId)
  //       .onSnapshot((snapshot) => {
  //         snapshot.docs.map((doc) => setQuest(doc.data()));
  //       });

  //     return unsubscribe;
  //   }
  // }, [props]);

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
        history.push("/quests");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newQuest = () => {
    setQuest(initialQuestState);
  };

  return (
    <Grid>
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
  );
};

export default CreateQuest;
