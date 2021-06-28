import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
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
      <a href={props.url}>
        <img className="card-image rounded" src={props.thumbnail} alt="" />
      </a>

      <IonCardHeader className="card-header">
        <IonCardSubtitle>{props.author}</IonCardSubtitle>
        <IonCardTitle>{props.title}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default VideoCard;
