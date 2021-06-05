import React, { useState, useEffect } from "react";
import QuestDataService from "../../services/QuestService";
import QuestContext from "../../contexts/QuestContext.jsx"
import QuestViewer from "./QuestViewer.jsx";
import QuestReader from "./QuestReader.jsx";
import QuestEditor from "../editor/QuestEditor.jsx";

function renderView(role) {
  if (role === "play") {
    console.log("Player role.")
    return <h1>Quest Player</h1>;
  } else if (role === "read") {
    return <QuestReader />;
  } else if (role === "edit") {
    return <QuestEditor />;
  } else {
    return <QuestViewer />;
  }
}

const Quest = (props) => {
  const role = props.match.params.role;

  // Quest
  // Primary container for each of the Quest elements
  // Below are the basic details of the Quest

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

  // Locations
  // Places on the map that contain events and items

  const initialLocationState = {
    id: "",
    name: "",
    order: 0,
    latitude: 0,
    longitude: 0,
    bearing: 0,
    pitch: 0,
    zoom: 0,
    image: "",
    marker: "",
    isLandmark: false,
    isStartingPoint: false,
  };

  const [locationIndex, setLocationIndex] = useState(-1);

  const [location, setLocation] = useState(initialLocationState);

  function handleSelectLocation(event) {
    const { id } = event.features[0].properties;
    const index = findWithAttr(quest.locations, "id", id);
    setLocationIndex(index);
    setLocation(quest.locations[index]);
  }

  // Entries
  // Short text entries that are displayed at a location
  // Usually provide readers with a set of actions to choose from

  // Items
  // Objects that are small enough to fit inside a backpack
  // Usually contain actions for the players to perform

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
    <QuestContext.Provider value={{quest, location, add: handleAddItem, remove: handleRemoveItem, selectLocation: handleSelectLocation}}>
      { renderView(role) }
    </QuestContext.Provider>
  );
};

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

export default Quest;
