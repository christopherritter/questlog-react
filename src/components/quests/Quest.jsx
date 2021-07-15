import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import QuestDataService from "../../services/QuestService";
import QuestContext from "../../contexts/QuestContext.jsx";
import QuestPlayer from "./QuestPlayer.jsx";
import QuestViewer from "./QuestViewer.jsx";
import QuestReader from "./QuestReader.jsx";
import QuestEditor from "../editor/QuestEditor.jsx";

function renderView({ role, currentUser, authorId }) {
  if (role === "play") {
    return <QuestPlayer />;
  } else if (role === "read") {
    return <QuestReader />;
  } else if (role === "edit") {
    if (currentUser && authorId) {
      if (currentUser.uid !== authorId) {
        return <Redirect to="/login" />;
      } else {
        return <QuestEditor />;
      }
    }
  } else {
    return <QuestViewer />;
  }
}

const Quest = (props) => {
  const { setQuestId, setQuestTitle } = props;
  const { role, questId } = props.match.params;
  const { currentUser } = useAuth();

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
      .where("questId", "==", questId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          var q = doc.data();
          setQuestId(q.questId);
          setQuestTitle({ title: q.title, id: q.questId });
          return setQuest(q);
        });
      });

    return unsubscribe;
  }, [questId, setQuestId, setQuestTitle]);

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

  // Objectives
  // The ultimate goals for the quest
  // Used to define the state of the quest

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
  };

  const [location, setLocation] = useState(initialLocationState);

  function handleSelectLocation(id) {
    const index = findWithAttr(quest.locations, "id", id);
    const selectedLocation = quest.locations[index];

    const filteredEntries = quest.entries.filter(
      (entry) => entry.locationId === selectedLocation.id
    );

    filteredEntries.forEach((entry) => {
      if (entry.objectives.length > 0) {
        entry.objectives.map((objectiveId) => {
          const objectiveIndex = findWithAttr(
            quest.objectives,
            "id",
            objectiveId
          );
          const updatedObjective = {
            ...quest.objectives[objectiveIndex],
            isComplete: true,
          };
          const updatedObjectives = [...quest.objectives];

          updatedObjectives[objectiveIndex] = updatedObjective;

          return setQuest({ ...quest, objectives: updatedObjectives });
        });
      }
    });

    setLocation(() => { return selectedLocation });
  }

  function handleAddLocation(location) {
    if (quest.locations) {
      setQuest({ ...quest, locations: [...quest.locations, location] });
    } else {
      setQuest({ ...quest, locations: [location] });
    }
  }

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
    updatedLocations[selectedLocation] = updatedLocation;

    setQuest({ ...quest, locations: updatedLocations });
  }

  function handleRemoveLocation(location) {
    const updatedLocations = quest.locations.filter(
      (loc) => loc.id !== location.id
    );
    setQuest({ ...quest, locations: updatedLocations });
    // setLocationIndex(-1);
    setLocation(null);
  }

  function handleClearLocation() {
    // setLocationIndex(-1);
    setLocation(null);
  }

  // Entries
  // Short text entries that are displayed at a location
  // Usually provide readers with a set of actions to choose from

  // const [entryIndex, setEntryIndex] = useState(-1);

  const [entry, setEntry] = useState();

  function handleAddEntry(entry) {
    if (quest.entries) {
      setQuest({ ...quest, entries: [...quest.entries, entry] });
    } else {
      setQuest({ ...quest, entries: [entry] });
    }
  }

  function handleUpdateEntry(entry) {
    const selectedEntry = quest.entries.findIndex(function (ent) {
      return entry.id === ent.id;
    });
    let updatedEntries = [...quest.entries];
    let updatedEntry = { ...quest.entries[selectedEntry] };

    updatedEntry = { ...entry };
    updatedEntries[selectedEntry] = updatedEntry;

    setQuest({ ...quest, entries: updatedEntries });
  }

  function handleRemoveEntry(entry) {
    const updatedEntries = quest.entries.filter((ent) => ent.id !== entry.id);
    setQuest({ ...quest, entries: updatedEntries });
    // setEntryIndex(-1);
    setEntry(null);
  }

  function handleClearEntry() {
    // setEntryIndex(-1);
    setEntry(null);
  }

  // Items
  // Objects that are small enough to fit inside a backpack
  // Usually contain actions for the players to perform

  const [itemIndex, setItemIndex] = useState(-1);

  const [item, setItem] = useState();

  function handleAddItem(item) {
    if (quest.items) {
      setQuest({ ...quest, items: [...quest.items, item] });
    } else {
      setQuest({ ...quest, items: [item] });
    }
  }

  function handleUpdateItem(item) {
    const selectedItem = quest.items.findIndex(function (i) {
      return item.id === i.id;
    });
    let updatedItems = [...quest.items];
    let updatedItem = { ...quest.items[selectedItem] };

    updatedItem = { ...item };
    updatedItems[selectedItem] = updatedItem;

    setQuest({ ...quest, items: updatedItems });
  }

  function handleRemoveItem(item) {
    const updatedItems = quest.items.filter((i) => i.id !== item.id);
    setQuest({ ...quest, items: updatedItems });
    setItemIndex(-1);
    setItem(null);
  }

  function handleClearItem() {
    setItemIndex(-1);
    setItem(null);
  }

  function handleTakeItem(action) {
    let updatedObjectives = [...quest.objectives];

    for (let i = 0; i < action.effects.length; i++) {
      const objectiveIndex = findWithAttr(
        updatedObjectives,
        "id",
        action.effects[i]
      );
      let updatedObjective = { ...updatedObjectives[objectiveIndex] };

      updatedObjective = { ...updatedObjective, isComplete: true };
      updatedObjectives[objectiveIndex] = updatedObjective;
    }

    const itemIndex = findWithAttr(quest.items, "id", action.targetId);
    let updatedItems = [...quest.items];
    let updatedItem = { ...quest.items[itemIndex] };

    updatedItem = { ...updatedItem, isOwned: true };
    updatedItems[itemIndex] = updatedItem;

    setItemIndex(itemIndex);
    setItem(updatedItem);
    setQuest({ ...quest, objectives: updatedObjectives, items: updatedItems });
  }

  function handleViewItem(item) {
    const index = findWithAttr(quest.items, "id", item.id);
    const selectedItem = { ...quest.items[index] };

    setItemIndex(itemIndex);
    setItem(selectedItem);
  }

  function handleOperateItem(action) {
    if (action.effects) {
      let updatedObjectives = [...quest.objectives];

      action.effects.forEach((effect) => {
        let objectiveIndex = findWithAttr(quest.objectives, "id", effect);
        let updatedObjective = {
          ...quest.objectives[objectiveIndex],
          isComplete: true,
        };

        updatedObjectives[objectiveIndex] = updatedObjective;
      });

      setQuest({ ...quest, objectives: updatedObjectives });
      setTimeout(() => {
        setItem(null);
        setItemIndex(-1);
      }, 150);
    }
  }

  // Actions
  // Actions may be taken by the user to move the story
  // They are associated with Entries and Items

  const [action, setAction] = useState();

  function handleAddAction(action) {
    if (quest.actions) {
      setQuest({ ...quest, actions: [...quest.actions, action] });
    } else {
      setQuest({ ...quest, actions: [action] });
    }
  }

  function handleUpdateAction(action) {
    const selectedAction = quest.actions.findIndex(function (a) {
      return action.id === a.id;
    });
    let updatedActions = [...quest.actions];
    let updatedAction = { ...quest.actions[selectedAction] };

    updatedAction = { ...action };
    updatedActions[selectedAction] = updatedAction;

    setQuest({ ...quest, actions: updatedActions });
  }

  function handleRemoveAction(action) {
    console.log("Quest: handleRemoveAction", action.id);
    const updatedActions = quest.actions.filter((a) => a.id !== action.id);
    setQuest({ ...quest, actions: updatedActions });
    // setActionIndex(-1);
    setAction(null);
  }

  function handleClearAction() {
    // setActionIndex(-1);
    setAction(null);
  }

  function handlePublishQuest() {
    console.log("Publish quest");
    QuestDataService.update(quest.questId, quest)
      .then(() => {
        console.log("Updated!");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Types

  const markerTypes = [
    {
      name: "Home",
      value: "home",
    },
    {
      name: "Barn",
      value: "barn",
    },
    {
      name: "Tractor",
      value: "tractor",
    },
    {
      name: "Grass",
      value: "grass",
    },
    {
      name: "Corn",
      value: "corn",
    },
    {
      name: "Church",
      value: "church",
    },
    {
      name: "Road",
      value: "road",
    },
    {
      name: "Home (Outline)",
      value: "home-outline",
    },
    {
      name: "Routes",
      value: "routes",
    },
    {
      name: "Sign",
      value: "sign",
    },
    {
      name: "Campfire",
      value: "campfire",
    },
  ];

  const actionTypes = [
    {
      name: "Look",
      value: "look",
    },
    {
      name: "Move",
      value: "move",
    },
    {
      name: "Take",
      value: "take",
    },
    {
      name: "Operate",
      value: "operate",
    },
    {
      name: "Next",
      value: "next",
    },
    {
      name: "Back",
      value: "back",
    },
  ];

  // const [state, setState] = useState({page: {}})
  // const setPageContext = useCallback(
  //   newState => {
  //     setState({page: {...state.page, ...newState}})
  //   },
  //   [state, setState],
  // )
  // const getContextValue = useCallback(
  //   () => ({setPageContext, ...state}),
  //   [state, updateState],
  // )

  return (
    <QuestContext.Provider
      value={{
        questId,
        role,
        quest,
        location,
        entry,
        item,
        action,
        setQuest,
        setLocation,
        // setLocationIndex,
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
        takeQuestItem: handleTakeItem,
        viewQuestItem: handleViewItem,
        operateQuestItem: handleOperateItem,
        addAction: handleAddAction,
        updateAction: handleUpdateAction,
        removeAction: handleRemoveAction,
        clearAction: handleClearAction,
        publishQuest: handlePublishQuest,
        findWithAttr,
        markerTypes,
        actionTypes,
      }}
    >
      {renderView({ role, currentUser, authorId: quest.authorId })}
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
