import React, { useContext } from "react";
import QuestContext from "../../contexts/QuestContext.jsx";

import { makeStyles } from "@material-ui/core/styles";
import { green, pink, grey } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";

import AlertIcon from "mdi-material-ui/AlertOctagram";
import BabyIcon from "mdi-material-ui/BabyFace";
import BaseballBatIcon from "mdi-material-ui/BaseballBat";
import BaseballDiamondIcon from "mdi-material-ui/BaseballDiamond";
import BarnIcon from "mdi-material-ui/Barn";
import BridgeIcon from "mdi-material-ui/Bridge";
import BugIcon from "mdi-material-ui/Bee";
import CampfireIcon from "mdi-material-ui/Campfire";
import ChurchIcon from "mdi-material-ui/Church";
import CornIcon from "mdi-material-ui/Corn";
import DeathlyHallowsIcon from "mdi-material-ui/DeathlyHallows";
import GrassIcon from "mdi-material-ui/Grass";
import HomeIcon from "mdi-material-ui/Home";
import HomeOutlineIcon from "mdi-material-ui/HomeOutline";
import MapMarkerIcon from "mdi-material-ui/MapMarker";
import MountainIcon from "mdi-material-ui/ImageFilterHdr";
import PawIcon from "mdi-material-ui/Paw";
import ParkingIcon from "mdi-material-ui/Parking";
import PineTreeIcon from "mdi-material-ui/PineTree";
import PoisonIcon from "mdi-material-ui/BottleTonicSkull";
import RoadIcon from "mdi-material-ui/RoadVariant";
import RoutesIcon from "mdi-material-ui/Routes";
import SignIcon from "mdi-material-ui/SignText";
import SilverwareIcon from "mdi-material-ui/Silverware";
import SkullIcon from "mdi-material-ui/Skull";
import SlideIcon from "mdi-material-ui/Slide";
import TelescopeIcon from "mdi-material-ui/Telescope";
import TornadoIcon from "mdi-material-ui/WeatherTornado";
import TractorIcon from "mdi-material-ui/TractorVariant";
import TreeIcon from "mdi-material-ui/Tree";

const useStyles = makeStyles((theme) => ({
  symbol: {
    cursor: "pointer",
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: "#fff",
    backgroundColor: green[500],
    borderColor: green[800],
    borderWidth: 2,
    borderStyle: "solid",
    zIndex: 100,
  },
  darkGrey: {
    color: "#fff",
    backgroundColor: grey[800],
    zIndex: 10,
  },
  hidden: {
    color: "#fff",
    backgroundColor: grey[800],
    zIndex: 10,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const QuestMapSymbol = (props) => {
  const { location: currentLocation, role } = useContext(QuestContext);
  const { location } = props;
  const classes = useStyles(props);

  const switchSymbol = (symbol) => {
    switch (symbol) {
      case "alert":
        return <AlertIcon />;
      case "baby":
        return <BabyIcon />;
      case "baseball-bat":
        return <BaseballBatIcon />;
      case "baseball-diamond":
        return <BaseballDiamondIcon />;
      case "barn":
        return <BarnIcon />;
      case "bridge":
        return <BridgeIcon />;
      case "bug":
        return <BugIcon />;
      case "campfire":
        return <CampfireIcon />;
      case "church":
        return <ChurchIcon />;
      case "corn":
        return <CornIcon />;
      case "deathly-hallows":
        return <DeathlyHallowsIcon />;
      case "grass":
        return <GrassIcon />;
      case "home":
        return <HomeIcon />;
      case "home-outline":
        return <HomeOutlineIcon />;
      case "mountain":
        return <MountainIcon />;
      case "paw":
        return <PawIcon />;
      case "parking":
        return <ParkingIcon />;
      case "pine-tree":
        return <PineTreeIcon />;
      case "playground":
        return <SlideIcon />;
      case "poison":
        return <PoisonIcon />;
      case "road":
        return <RoadIcon />;
      case "routes":
        return <RoutesIcon />;
      case "sign":
        return <SignIcon />;
      case "restaurant":
        return <SilverwareIcon />;
      case "skull":
        return <SkullIcon />;
      case "telescope":
        return <TelescopeIcon />;
      case "tornado":
        return <TornadoIcon />;
      case "tractor":
        return <TractorIcon />;
      case "tree":
        return <TreeIcon />;
      default:
        return <MapMarkerIcon />;
    }
  };

  return (
    <Avatar
      className={
        classes.symbol +
        " " +
        (role && currentLocation
          ? location.id === currentLocation.id
            ? classes.green
            : classes.hidden
          : classes.darkGrey)
      }
    >
      {switchSymbol(location.marker)}
    </Avatar>
  );
};

export default QuestMapSymbol;
