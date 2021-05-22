import React, { useRef } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const QuestMap = (props) => {
  const mapRef = useRef();

  const onClick = (event) => {
    const { lngLat } = event;

    const newViewport = {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };

    console.log(newViewport)
  };

  const onDragEnd = (event) => {
    console.log(event)
  };

  return (
    <MapGL
      ref={mapRef}
      style={{ width: props.width, height: props.height }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      latitude={props.latitude}
      longitude={props.longitude}
      zoom={props.zoom}
      onViewportChange={props.updateCenter}
      onClick={onClick}
      onDragEnd={onDragEnd}
    />
  );
};

export default QuestMap;
