import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { logoGithub } from "ionicons/icons";

const GitHubIcon: React.FC = () => {
  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed" translate="no">
      <IonFabButton color="dark" href="https://github.com/sonodima/tubero">
        <IonIcon icon={logoGithub} />
      </IonFabButton>
    </IonFab>
  );
};

export default GitHubIcon;
