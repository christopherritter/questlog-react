import React from "react";
import { Marker } from "@urbica/react-map-gl";

import { makeStyles } from "@material-ui/core/styles";
import { green, pink } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import MapMarkerIcon from "mdi-material-ui/MapMarker";

const useStyles = makeStyles((theme) => ({
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: "#fff",
    backgroundColor: green[500],
  },
}));

const QuestMapMarker = (props) => {
  const classes = useStyles(props);
  const { location } = props;

  const onMarkerClick = (event) => {
    const locationId = {
      lngLat: {
        lng: location.longitude,
        lat: location.latitude,
      },
      features: [
        {
          properties: {
            id: location.id,
            bearing: location.bearing,
            pitch: location.pitch,
            zoom: location.zoom,
          },
        },
      ],
    };
    props.viewLocation(locationId);
  };

  {
    /* <QuestMapMarker
                id={location.id}
                longitude={location.longitude}
                latitude={location.latitude}
                bearing={location.bearing}
                pitch={location.pitch}
                zoom={location.zoom}
                key={index}
                viewLocation={viewLocation}
              >
                <Avatar className={classes.pink}>
                  <MapMarkerIcon />
                </Avatar>
              </QuestMapMarker> */
  }

  return (
    <Marker
      id={location.id}
      longitude={location.longitude}
      latitude={location.latitude}
      bearing={location.bearing}
      pitch={location.pitch}
      zoom={location.zoom}
      onClick={onMarkerClick}
      {...props}
    >
      <Avatar className={classes.pink}>
        <MapMarkerIcon />
      </Avatar>
    </Marker>
  );
};

export default QuestMapMarker;
