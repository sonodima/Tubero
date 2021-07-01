import { IonImg, IonText } from "@ionic/react";
import "./ErrorMessage.css";

interface ErrorProps {
  title: string;
  subtitle: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ children, title, subtitle }) => {
  return (
    <div className="container">
      <IonImg className="error-image" src="/assets/images/tubero-sad.svg" />
      <IonText color="primary">
        <h2>{title}</h2>
      </IonText>

      <p>{subtitle}</p>
      {children}
    </div>
  );
};

export default ErrorMessage;
