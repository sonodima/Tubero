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
  borderless?: boolean;
}

const VideoCard: React.FC<CardProps> = ({
  url,
  isUrlExternal,
  title,
  author,
  thumbnail,
  borderless,
}) => {
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
            src={thumbnail}
            alt=""
            onLoad={() => setImgLoaded(true)}
          />
        </motion.div>
      </div>
    );
  };

  return (
    <IonCard className={`rounded ${borderless ? "borderless" : ""}`}>
      {thumbnail && url ? (
        <>
          {!imgLoaded ? (
            <IonSkeletonText animated className="card-image-skeleton rounded" />
          ) : null}

          {isUrlExternal ? (
            <a href={url}>
              <CardImage />
            </a>
          ) : (
            <Link to={url}>
              <CardImage />
            </Link>
          )}
        </>
      ) : (
        <IonSkeletonText animated className="card-image-skeleton rounded" />
      )}

      <IonCardHeader className="card-header">
        {author ? (
          <IonCardSubtitle className="text-wrap">{author}</IonCardSubtitle>
        ) : (
          <IonSkeletonText animated className="card-author-skeleton" />
        )}

        {title ? (
          <IonCardTitle className="text-wrap">{title}</IonCardTitle>
        ) : (
          <IonSkeletonText animated className="card-title-skeleton" />
        )}
      </IonCardHeader>
    </IonCard>
  );
};

VideoCard.defaultProps = {
  isUrlExternal: false,
  borderless: true,
};

export default VideoCard;
