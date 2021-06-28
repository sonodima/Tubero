import { IonContent, IonHeader, IonPage, IonSearchbar } from "@ionic/react";

import CustomToolbar from "../components/CustomToolbar";
import GitHubButton from "../components/GitHubButton";
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
        <GitHubButton />
      </IonContent>
    </IonPage>
  );
};

export default Home;
