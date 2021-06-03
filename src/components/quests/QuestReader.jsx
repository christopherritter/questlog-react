import React, { useRef, useState, useContext } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    backgroundColor: "rgba(35, 55, 75, 0.9)",
    color: "#ffffff",
    padding: "6px 12px",
    fontFamily: "monospace",
    zIndex: "1",
    position: "absolute",
    top: "64px",
    left: "0",
    margin: "12px",
    borderRadius: "4px",
  },
}));

function QuestReader(props) {
  const classes = useStyles();
  const { quest, updateCenter } = useContext(QuestContext);

  const [showSidebar, toggleShowSidebar] = useState(true);

  const mapRef = useRef();

  const onClick = (event) => {
    const { lngLat } = event;

    const mapCoords = {
      latitude: lngLat.lat,
      longitude: lngLat.lng,
    };

    console.log(event);
    // props.mapClick(event);
  };

  const onDragEnd = (event) => {
    console.log(event);
  };

  return (
    <Box>
      {quest.region && (
        <React.Fragment>
          {showSidebar && (
            <div className={classes.sidebar}>
              Longitude: {quest.region.longitude} | Latitude:{" "}
              {quest.region.latitude} | Zoom: {quest.region.zoom}
            </div>
          )}
          <MapGL
            ref={mapRef}
            style={{ width: "100%", height: "calc(100vh - 64px)" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            latitude={quest.region.latitude}
            longitude={quest.region.longitude}
            bearing={quest.region.bearing}
            pitch={quest.region.pitch}
            zoom={quest.region.zoom}
            onViewportChange={updateCenter}
            onClick={onClick}
            onDragEnd={onDragEnd}
          />
        </React.Fragment>
      )}
    </Box>
  );
}

export default QuestReader;
