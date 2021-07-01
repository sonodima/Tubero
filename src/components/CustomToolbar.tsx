import {
  isPlatform,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import "./CustomToolbar.css";

const CustomToolbar: React.FC = ({ children }) => {
  if (isPlatform("ios")) {
    return (
      <div>
        <IonToolbar>
          <IonTitle size="large">tubero</IonTitle>
        </IonToolbar>
        <IonToolbar>{children}</IonToolbar>
      </div>
    );
  } else {
    return (
      <IonToolbar>
        <IonGrid>
          <IonRow>
            <IonCol className="title-container">
              <IonTitle>tubero</IonTitle>
            </IonCol>
            <IonCol
              sizeXl="6"
              pullXl="3"
              sizeLg="6"
              pullLg="3"
              sizeMd="6"
              pullMd="3"
              pullXs="0"
              sizeXs="12"
            >
              {children}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    );
  }
};

export default CustomToolbar;
