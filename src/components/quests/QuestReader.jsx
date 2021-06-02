import React, { useRef, useContext } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

function QuestReader(props) {
  const { quest, updateCenter } = useContext(QuestContext);
  const mapRef = useRef();

  const onClick = (event) => {
    // const { lngLat } = event;

    // const mapCoords = {
    //   latitude: lngLat.lat,
    //   longitude: lngLat.lng,
    // };

    // console.log(event)
    props.mapClick(event);
  };

  const onDragEnd = (event) => {
    console.log(event);
  };

  return (
    <Container>
      <Grid container>
        {quest.region && (
          <MapGL
            ref={mapRef}
            style={{ width: "100vw", height: "100vh" }}
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
        )}
      </Grid>
    </Container>
  );
}

export default QuestReader;
