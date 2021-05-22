import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
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
    latitude: 39.82835,
    longitude: -98.5816737,
    name: "Geographic Center of the United States",
    zoom: 12.5,
  };
  
  const [quest, setQuest] = useState(initialQuestState);
  const [currentRegion, setCurrentRegion] = useState(initialRegionState);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(props)
    const unsubscribe = QuestDataService.getAll()
      .where("questId", "==", props.match.params.questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setQuest(doc.data()));
      });

    return unsubscribe;
  }, [props]);

  return (
    <Grid>
      <h1 className="mt-5">{ quest.title }</h1>
      <p>{ quest.description }</p>
    </Grid>
  );
};

export default Quest;
