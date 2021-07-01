import { IonModal, IonGrid, IonRow, IonCol, IonButton } from "@ionic/react";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./ConversionModal.css";

interface ModalProps {
  isOpen: boolean;
  progress: number;
  onCancel: () => void;
}

const ConversionModal: React.FC<ModalProps> = ({
  isOpen,
  progress,
  onCancel,
}) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonGrid>
        <IonRow className="ion-justify-content-center">
          <IonCol sizeXs="8">
            <CircularProgressbar
              strokeWidth={6}
              value={progress}
              text={`${progress}%`}
            />
          </IonCol>
        </IonRow>

        <IonRow className="ion-justify-content-center">
          <IonButton
            shape="round"
            expand="full"
            color="medium"
            onClick={onCancel}
          >
            Cancel
          </IonButton>
        </IonRow>
      </IonGrid>
    </IonModal>
  );
};

export default ConversionModal;
