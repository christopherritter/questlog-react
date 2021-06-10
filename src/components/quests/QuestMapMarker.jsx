import React from "react";
import { Marker } from "@urbica/react-map-gl";

import { makeStyles } from "@material-ui/core/styles";
import { green, pink, grey } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import MapMarkerIcon from "mdi-material-ui/MapMarker";
import HomeIcon from "mdi-material-ui/Home";
import BarnIcon from "mdi-material-ui/Barn";
import TractorIcon from "mdi-material-ui/TractorVariant";
import GrassIcon from "mdi-material-ui/Grass";
import CornIcon from "mdi-material-ui/Corn";
import ChurchIcon from "mdi-material-ui/Church";
import RoadIcon from "mdi-material-ui/RoadVariant";
import HomeOutlineIcon from "mdi-material-ui/HomeOutline";
import RoutesIcon from "mdi-material-ui/Routes";
import SignIcon from "mdi-material-ui/SignText";
import CampfireIcon from "mdi-material-ui/Campfire";

const useStyles = makeStyles((theme) => ({
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: "#fff",
    backgroundColor: green[500],
  },
  darkGrey: {
    color: "#fff",
    backgroundColor: grey[800],
  },
}));

const QuestMapMarker = (props) => {
  const classes = useStyles(props);
  const { location, viewLocation } = props;

  function onMarkerClick() {
    viewLocation(location);
  };

  const switchMarker = (marker) => {
    switch (marker) {
      case "home":
        return <HomeIcon />;
      case "barn":
        return <BarnIcon />;
      case "tractor":
        return <TractorIcon />;
      case "grass":
        return <GrassIcon />;
      case "corn":
        return <CornIcon />;
      case "church":
        return <ChurchIcon />;
      case "road":
        return <RoadIcon />;
      case "home-outline":
        return <HomeOutlineIcon />;
      case "routes":
        return <RoutesIcon />;
      case "sign":
        return <SignIcon />;
      case "campfire":
        return <CampfireIcon />;
      default:
        return <MapMarkerIcon />;
    }
  };

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
      <Avatar className={classes.darkGrey}>
        {switchMarker(location.marker)}
      </Avatar>
    </Marker>
  );
};

export default QuestMapMarker;
