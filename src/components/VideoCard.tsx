import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from "@ionic/react";
import { Link } from "react-router-dom";

import "./VideoCard.css";

interface CardProps {
  url: string;
  title?: string;
  author?: string;
  thumbnail?: string;
}

const VideoCard: React.FC<CardProps> = (props) => {
  return (
    <IonCard className="rounded">
      {props.thumbnail ? (
        <Link to={props.url}>
          <img className="card-image rounded" src={props.thumbnail} alt="" />
        </Link>
      ) : (
        <IonSkeletonText className="card-image-skeleton rounded" />
      )}

      <IonCardHeader className="card-header">
        {props.author ? (
          <IonCardSubtitle className="text-wrap">
            {props.author}
          </IonCardSubtitle>
        ) : (
          <IonSkeletonText className="card-author-skeleton" />
        )}

        {props.title ? (
          <IonCardTitle className="text-wrap">{props.title}</IonCardTitle>
        ) : (
          <IonSkeletonText className="card-title-skeleton" />
        )}
      </IonCardHeader>
    </IonCard>
  );
};

export default VideoCard;
