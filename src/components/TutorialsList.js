import React, { useState, useEffect } from "react";
import TutorialDataService from "../services/TutorialService";
import Tutorial from "./Tutorial";

const TutorialsList = () => {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const onDataChange = (items) => {
    let tutorials = [];

    items.docs.forEach((item) => {
      let id = item.id;
      let data = item.data();
      tutorials.push({
        id: id,
        title: data.title,
        description: data.description,
        published: data.published,
      });
    });

    setTutorials(tutorials);
  };

  useEffect(() => {
    const unsubscribe = TutorialDataService.getAll().orderBy("title", "asc").onSnapshot(onDataChange);

    return () => unsubscribe();
  }, []);


  const refreshList = () => {
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    const { title, description, published } = tutorial;

    setCurrentTutorial({
      id: tutorial.id,
      title,
      description,
      published,
    });

    setCurrentIndex(index);
  };
  
  return (
    <div className="list row">
      <div className="col-md-6">
        <h4>Tutorials List</h4>

        <ul className="list-group">
          { tutorials &&
            tutorials.map((tutorial, index) => 
              <li
                className={"list-group-item " + (index === currentIndex ? "active" : "")}
                onClick={() => setActiveTutorial(tutorial, index)}
                key={tutorial.id}
              >
                { tutorial.title }
              </li>
            )}
        </ul>
      </div>
      <div className="col-md-6">
        {currentTutorial ? (
          <Tutorial tutorial={currentTutorial} refreshList={refreshList} />
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsList;
