import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
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
    <Container>
      <Row>
        <Col>
          <h1 className="mt-5 mb-4">Quest Editor</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="formQuestTitle">
              <Form.Label>Quest Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter the title of your quest"
                value={quest.title}
                onChange={handleInputChange}
                name="title"
              />
            </Form.Group>
            <Form.Group controlId="formQuestDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Describe your quest and how to play"
                value={quest.description}
                onChange={handleInputChange}
                name="description"
              />
            </Form.Group>
            <Button variant="success" type="submit" onClick={saveQuest}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default QuestEditor;
