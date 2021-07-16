import React, { useRef } from "react";
import { Marker } from "@urbica/react-map-gl";

import QuestMapSymbol from "./QuestMapSymbol.jsx";

const QuestMapMarker = (props) => {
  const { location, viewLocation } = props;
  const markerRef = useRef();

  const onMarkerClick = () => {
    viewLocation(location.id);
  };

  return (
    <Marker
      ref={markerRef}
      longitude={location.longitude}
      latitude={location.latitude}
      bearing={location.bearing}
      pitch={location.pitch}
      zoom={location.zoom}
      onClick={onMarkerClick}
      {...props}
    >
      <QuestMapSymbol
        location={location}
      />
    </Marker>
  );
};

export default QuestMapMarker;
