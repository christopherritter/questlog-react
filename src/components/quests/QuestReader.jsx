import React, { useRef, useState, useContext } from "react";
import MapGL from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const sidebarWidth = 275;

const useStyles = makeStyles((theme) => ({
  sidebar: {
    zIndex: "1",
    position: "absolute",
    top: "64px",
    left: "0",
    margin: "12px",
    borderRadius: "4px",
    width: sidebarWidth,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
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

  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Box>
      {quest.region && (
        <React.Fragment>
          {showSidebar && (
            <Card className={classes.sidebar}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant="h5" component="h2">
                  be{bull}nev{bull}o{bull}lent
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  adjective
                </Typography>
                <Typography variant="body2" component="p">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
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
