import { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
  isPlatform,
} from "@ionic/react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import "./VideoCard.css";

interface CardProps {
  url?: string;
  isUrlExternal?: boolean;
  title?: string;
  author?: string;
  thumbnail?: string;
}

const VideoCard: React.FC<CardProps> = (props) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const CardImage: React.FC = () => {
    return (
      <div className="card-image-container rounded">
        <motion.div
          {...(isPlatform("desktop")
            ? {
                whileHover: {
                  scale: 1.08,
                },
              }
            : {
                whileTap: {
                  scale: 1.08,
                },
              })}
        >
          <img
            className="card-image "
            style={imgLoaded ? {} : { display: "none" }}
            src={props.thumbnail}
            alt=""
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>
      </div>
    );
  };

  return (
    <IonCard className="rounded">
      {props.thumbnail && props.url ? (
        <>
          {!imgLoaded ? (
            <IonSkeletonText animated className="card-image-skeleton rounded" />
          ) : null}

          {props.isUrlExternal ? (
            <a href={props.url}>
              <CardImage />
            </a>
          ) : (
            <Link to={props.url}>
              <CardImage />
            </Link>
          )}
        </>
      ) : (
        <IonSkeletonText animated className="card-image-skeleton rounded" />
      )}

      <IonCardHeader className="card-header">
        {props.author ? (
          <IonCardSubtitle className="text-wrap">
            {props.author}
          </IonCardSubtitle>
        ) : (
          <IonSkeletonText animated className="card-author-skeleton" />
        )}

        {props.title ? (
          <IonCardTitle className="text-wrap">{props.title}</IonCardTitle>
        ) : (
          <IonSkeletonText animated className="card-title-skeleton" />
        )}
      </IonCardHeader>
    </IonCard>
  );
};

VideoCard.defaultProps = {
  isUrlExternal: false,
};

export default VideoCard;
