import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import QuestDataService from "../../services/QuestService";

const Quest = (props) => {
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
    coordinates: [],
    name: "North Park",
    zoom: 17,
  };
  
  const [currentQuest, setCurrentQuest] = useState(initialQuestState);
  const [currentRegion, setCurrentRegion] = useState(initialRegionState);
  const [error, setError] = useState("");

  const { quest } = props;

  useEffect(() => {
    const unsubscribe = QuestDataService.getAll()
      .where("questId", "==", props.questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setCurrentQuest(doc.data()));
      });

    return unsubscribe;
  }, [currentQuest]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Quest</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Quest;
