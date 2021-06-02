import React, { useState, useEffect } from "react";
import QuestDataService from "../../services/QuestService";
import QuestContext from "../../contexts/QuestContext.jsx"
import QuestViewer from "./QuestViewer.jsx";
import QuestReader from "./QuestReader.jsx";

function renderView(role) {
  if (role === "play") {
    console.log("Player role.")
    return <h1>Quest Player</h1>;
  } else if (role === "read") {
    return <QuestReader />;
  } else if (role === "edit") {
    console.log("Editor role.")
    return <h1>Quest Editor</h1>;
  } else {
    return <QuestViewer />;
  }
}

const Quest = (props) => {
  const role = props.match.params.role;

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

  useEffect(() => {
    const unsubscribe = QuestDataService.getAll()
      .where("questId", "==", props.match.params.questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => setQuest(doc.data()));
      });

    return unsubscribe;
  }, [props.match.params.questId]);

  function handleAddItem(item) {
    // setItems([...items, item]);
    console.log("Handle Add Item")
  }

  function handleRemoveItem(index) {
    // const copy = [...items];
    // copy.splice(index, 1);
    // setItems(copy);
    console.log("Handle Remove Item")
  }

  return (
    <QuestContext.Provider value={{quest, add: handleAddItem, remove: handleRemoveItem}}>
      { renderView(role) }
    </QuestContext.Provider>
  );
};

export default Quest;
