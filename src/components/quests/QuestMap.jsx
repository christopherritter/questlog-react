import React from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const QuestMap = (props) => {
  const onClick = (event) => {
    const { lngLat } = event;

    const newViewport = {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };

    console.log(newViewport)
  };

  return (
    <MapGL
      style={{ width: props.width, height: props.height }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      latitude={props.latitude}
      longitude={props.longitude}
      zoom={props.zoom}
      onClick={onClick}
    />
  );
};

export default QuestMap;
