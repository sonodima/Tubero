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
      <div className="container">
        <h1>Converting</h1>
        <CircularProgressbar
          strokeWidth={6}
          value={progress}
          text={`${progress}%`}
        />

        <IonButton
          shape="round"
          expand="full"
          color="medium"
          onClick={onCancel}
        >
          Cancel
        </IonButton>
      </div>
    </IonModal>
  );
};

export default ConversionModal;
