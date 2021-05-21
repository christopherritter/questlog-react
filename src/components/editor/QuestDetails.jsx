import React from "react";
import PropTypes from "prop-types";

function QuestDetails(props) {
  return (
    <div>
      <h1>{props.quest.title}</h1>
    </div>
  );
}

QuestDetails.propTypes = {
  quest: PropTypes.object,
};

export default QuestDetails;
