import React, { useRef } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestMapMarker from "./QuestMapMarker.jsx";

const QuestMap = ({ width, height, quest }) => {
  const mapRef = useRef();

  function handleSelectLocation() {}

  return (
    <MapGL
      ref={mapRef}
      style={{ width: width, height: height }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      latitude={quest.region.latitude}
      longitude={quest.region.longitude}
      bearing={quest.region.bearing}
      pitch={quest.region.pitch}
      zoom={quest.region.zoom}
    >
      {quest.locations.map((el, index) => (
        <QuestMapMarker
          location={el}
          key={index}
          selectLocation={handleSelectLocation}
        ></QuestMapMarker>
      ))}
    </MapGL>
  );
};

export default QuestMap;
