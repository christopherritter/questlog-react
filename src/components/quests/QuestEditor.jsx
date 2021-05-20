import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UserDataService from "../../services/UserService";
import QuestDataService from "../../services/QuestService";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useHistory } from "react-router-dom";

const QuestEditor = () => {
  const { currentUser } = useAuth();
  const initialQuestState = {
    questId: "",
    title: "",
    author: "",
    authorId: currentUser.uid,
    description: "",
    categories: [],
    image: "",
    featured: false,
    isAnonymous: false,
    isFeatured: false,
    startingPoint: "",
  };

  const [quest, setQuest] = useState(initialQuestState);
  const history = useHistory();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuest({ ...quest, [name]: value });
  };

  const saveQuest = (e) => {
    e.preventDefault();
    var data = {
      title: quest.title,
      author: quest.author,
      authorId: quest.authorId,
      description: quest.description,
      // categories: quest.categories,
      // image: quest.image,
      // featured: quest.isFeatured,
      // isAnonymous: quest.isAnonymous,
      // isFeatured: quest.isFeatured,
      // startingPoint: quest.description,
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
      <Grid>
        <h1 className="mt-5 mb-4">Quest Editor</h1>
      </Grid>
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
            autoComplete="questTitle"
            value={quest.title}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="questDescription"
            label="Description"
            name="description"
            autoComplete="questDescription"
            value={quest.description}
            onChange={handleInputChange}
          />
          <Button variant="success" type="submit" onClick={saveQuest}>
            Submit
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default QuestEditor;
