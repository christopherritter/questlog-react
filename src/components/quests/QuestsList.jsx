import React from "react";
import { Link } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import QuestDataService from "../../services/QuestService";
import { Container, Row, Col, Card } from "react-bootstrap";

const Quests = () => {
  const [quests, loading, error] = useCollection(
    QuestDataService.getAll().orderBy("title", "asc")
  );

  console.log(quests)

  return (
    <Container>
      <Row>
        <Col>
          <h1>Quests</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {error && <strong>Error: {error}</strong>}
          {loading && <span>Loading...</span>}
          {!loading &&
            quests &&
            quests.docs.map((quest, index) => (
              <Card style={{ width: "18rem" }} key={index}>
                <Card.Body>
                  <Card.Title>{ quest.data().title }</Card.Title>
                  <Card.Text>{ quest.data().description }</Card.Text>
                  <Link to={`/quest/${quest.data().questId}`} className="btn btn-primary">
                    View Quest
                  </Link>
                </Card.Body>
              </Card>
            ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Quests;
