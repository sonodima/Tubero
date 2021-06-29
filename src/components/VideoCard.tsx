import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { Link } from "react-router-dom";

import "./VideoCard.css";

interface CardProps {
  url: string;
  title: string;
  author: string;
  thumbnail: string;
}

const VideoCard: React.FC<CardProps> = (props) => {
  return (
    <IonCard className="rounded">
      <Link to={props.url}>
        <img className="card-image rounded" src={props.thumbnail} alt="" />
      </Link>

      <IonCardHeader className="card-header">
        <IonCardSubtitle>{props.author}</IonCardSubtitle>
        <IonCardTitle>{props.title}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default VideoCard;
