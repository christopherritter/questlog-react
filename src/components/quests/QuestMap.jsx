import React, { useRef } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import bbox from "@turf/bbox";
import { multiPoint } from "@turf/helpers";

import QuestMapMarker from "./QuestMapMarker.jsx";

const QuestMap = ({ width, height, quest }) => {
  const mapRef = useRef();

  function handleSelectLocation(event) { event.preventDefault() }
  
  function handleLocationOverview() {
    var coords = quest.locations.map((location) => {
      return [location.longitude, location.latitude];
    });
    var multiPt = multiPoint(coords);
    var bounds = bbox(multiPt);
    var padding = { left: 50, right: 50, top: 50, bottom: 75 };

    mapRef.current.fitBounds(bounds, {
      padding: padding,
    });
  }

  return (
    <MapGL
      ref={(ref) => (mapRef.current = ref && ref.getMap())}
      style={{ width: width, height: height }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      latitude={quest.region.latitude}
      longitude={quest.region.longitude}
      bearing={quest.region.bearing}
      pitch={quest.region.pitch}
      zoom={quest.region.zoom}
      onLoad={handleLocationOverview}
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
