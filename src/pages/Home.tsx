import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import CustomToolbar from "../components/CustomToolbar";
import GitHubButton from "../components/GitHubButton";
import VideoCard from "../components/VideoCard";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent>
        <CustomToolbar>
          <IonSearchbar></IonSearchbar>
        </CustomToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
              <VideoCard
                url="https://google.com"
                title="ciao"
                author="come"
                thumbnail="https://originedelmeme.altervista.org/wp-content/uploads/2020/06/dank.png"
              />
            </IonCol>
          </IonRow>
        </IonGrid>

        <GitHubButton />
      </IonContent>
    </IonPage>
  );
};

export default Home;
