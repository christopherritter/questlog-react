import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl';

const QuestMap = (props) => {
  const [viewport, setViewport] = useState({
    width: props.width,
    height: props.height,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    />
  );
};

export default QuestMap;