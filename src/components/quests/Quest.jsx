import React, { useState, useEffect } from "react";
import QuestDataService from "../../services/QuestService";
import QuestContext from "../../contexts/QuestContext.jsx";
import QuestViewer from "./QuestViewer.jsx";
import QuestReader from "./QuestReader.jsx";
import QuestEditor from "../editor/QuestEditor.jsx";

function renderView(role) {
  if (role === "play") {
    console.log("Player role.");
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

  function handleUpdateDetails(event) {
    const { name, value } = event.target;
    setQuest({ ...quest, [name]: value });
  }

  function handleUpdateRegion(event) {
    const { name, value } = event.target;
    setQuest({
      ...quest,
      region: {
        [name]: value,
      },
    });
  }

  function handleUpdateCenter(newRegion) {
    setQuest({ ...quest, region: newRegion });
  }

  function handleAddObjective(objective) {
    if (quest.objectives) {
      setQuest({ ...quest, objectives: [...quest.objectives, objective] });
    } else {
      setQuest({ ...quest, objectives: [objective] });
    }
  }

  function handleUpdateObjective(objective) {
    const selectedObjective = quest.objectives.findIndex(function (obj) {
      return objective.id === obj.id;
    });
    let updatedObjectives = [...quest.objectives];
    let updatedObjective = { ...quest.objectives[selectedObjective] };

    updatedObjective.text = objective.text;
    updatedObjective.isPrimary = objective.isPrimary;
    updatedObjective.isComplete = objective.isComplete;
    updatedObjectives[selectedObjective] = updatedObjective;

    setQuest({ ...quest, objectives: updatedObjectives });
  }

  function handleRemoveObjective(objective) {
    const updatedObjectives = quest.objectives.filter(
      (obj) => obj.id !== objective.id
    );
    setQuest({ ...quest, objectives: updatedObjectives });
  }

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

  function handleAddLocation(location) {
    if (quest.locations) {
      setQuest({ ...quest, locations: [...quest.locations, location] });
    } else {
      setQuest({ ...quest, locations: [location] });
    }
  };

  function handleUpdateLocation(location) {
    const selectedLocation = quest.locations.findIndex(function (loc) {
      return location.id === loc.id;
    });
    let updatedLocations = [...quest.locations];
    let updatedLocation = { ...quest.locations[selectedLocation] };

    updatedLocation.name = location.name;
    updatedLocation.latitude = location.latitude;
    updatedLocation.longitude = location.longitude;
    updatedLocation.bearing = location.bearing;
    updatedLocation.pitch = location.pitch;
    updatedLocation.zoom = location.zoom;
    updatedLocation.image = location.image;
    updatedLocation.marker = location.marker;
    updatedLocation.order = location.order;
    updatedLocation.isLandmark = location.isLandmark;
    updatedLocation.isStartingPoint = location.isStartingPoint;
    updatedLocations[selectedLocation] = updatedLocation;

    setQuest({ ...quest, locations: updatedLocations });
  };

  function handleRemoveLocation(location) {
    const updatedLocations = quest.locations.filter(
      (loc) => loc.id !== location.id
    );
    setQuest({ ...quest, locations: updatedLocations });
    setLocationIndex(-1);
    setLocation(null);
  };

  function handleClearLocation() {
    setLocationIndex(-1);
    setLocation(null);
  };

  // Entries
  // Short text entries that are displayed at a location
  // Usually provide readers with a set of actions to choose from

  const [entryIndex, setEntryIndex] = useState(-1);

  const [entry, setEntry] = useState();

  function handleAddEntry(entry) {
    if (quest.entries) {
      setQuest({ ...quest, entries: [...quest.entries, entry] });
    } else {
      setQuest({ ...quest, entries: [entry] });
    }
  };

  function handleUpdateEntry(entry) {
    const selectedEntry = quest.entries.findIndex(function (ent) {
      return entry.id === ent.id;
    });
    let updatedEntries = [...quest.entries];
    let updatedEntry = { ...quest.entries[selectedEntry] };

    updatedEntry = { ...entry };
    updatedEntries[selectedEntry] = updatedEntry;

    setQuest({ ...quest, entries: updatedEntries });
  };

  function handleRemoveEntry(entry) {
    const updatedEntries = quest.entries.filter((ent) => ent.id !== entry.id);
    setQuest({ ...quest, entries: updatedEntries });
    setEntryIndex(-1);
    setEntry(null);
  };

  function handleClearEntry() {
    setEntryIndex(-1);
    setEntry(null);
  };

  // Items
  // Objects that are small enough to fit inside a backpack
  // Usually contain actions for the players to perform

  const [itemIndex, setItemIndex] = useState(-1);

  const [item, setItem] = useState();

  function handleAddItem (item) {
    if (quest.items) {
      setQuest({ ...quest, items: [...quest.items, item] });
    } else {
      setQuest({ ...quest, items: [item] });
    }
  };

  function handleUpdateItem(item) {
    const selectedItem = quest.items.findIndex(function (i) {
      return item.id === i.id;
    });
    let updatedItems = [...quest.items];
    let updatedItem = { ...quest.items[selectedItem] };

    updatedItem = { ...item };
    updatedItems[selectedItem] = updatedItem;

    setQuest({ ...quest, items: updatedItems });
  };

  function handleRemoveItem(item) {
    const updatedItems = quest.items.filter((i) => i.id !== item.id);
    setQuest({ ...quest, items: updatedItems });
    setItemIndex(-1);
    setItem(null);
  };

  function handleClearItem() {
    setItemIndex(-1);
    setItem(null);
  };

  // Actions
  // Actions may be taken by the user to move the story
  // They are associated with Entries and Items

  const [actionIndex, setActionIndex] = useState(-1);

  const [action, setAction] = useState();

  function handleAddAction(action) {
    console.log("The top add action!");
    if (quest.actions) {
      setQuest({ ...quest, actions: [...quest.actions, action] });
    } else {
      setQuest({ ...quest, actions: [action] });
    }
  };

  function handleUpdateAction(action) {
    const selectedAction = quest.actions.findIndex(function (a) {
      return action.id === a.id;
    });
    let updatedActions = [...quest.actions];
    let updatedAction = { ...quest.actions[selectedAction] };

    updatedAction = { ...action };
    updatedActions[selectedAction] = updatedAction;

    setQuest({ ...quest, actions: updatedActions });
  };

  function handleRemoveAction(action) {
    const updatedActions = quest.actions.filter((a) => a.id !== action.id);
    setQuest({ ...quest, actions: updatedActions });
    setActionIndex(-1);
    setAction(null);
  };

  function handleClearAction() {
    setActionIndex(-1);
    setAction(null);
  };

  function handlePublishQuest() {
    console.log("Publish quest");
    QuestDataService.update(quest.questId, quest)
      .then(() => {
        console.log("Updated!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <QuestContext.Provider
      value={{
        quest,
        location,
        entry,
        item,
        action,
        setLocation,
        setLocationIndex,
        addLocation: handleAddLocation,
        selectLocation: handleSelectLocation,
        updateLocation: handleUpdateLocation,
        removeLocation: handleRemoveLocation,
        clearLocation: handleClearLocation,
        updateDetails: handleUpdateDetails,
        updateRegion: handleUpdateRegion,
        updateCenter: handleUpdateCenter,
        addObjective: handleAddObjective,
        updateObjective: handleUpdateObjective,
        removeObjective: handleRemoveObjective,
        addEntry: handleAddEntry,
        updateEntry: handleUpdateEntry,
        removeEntry: handleRemoveEntry,
        clearEntry: handleClearEntry,
        addItem: handleAddItem,
        updateItem: handleUpdateItem,
        removeItem: handleRemoveItem,
        clearItem: handleClearItem,
        addAction: handleAddAction,
        updateAction: handleUpdateAction,
        removeAction: handleRemoveAction,
        clearAction: handleClearAction,
        publishQuest: handlePublishQuest
      }}
    >
      {renderView(role)}
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
