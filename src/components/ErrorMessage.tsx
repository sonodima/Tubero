import { IonText } from "@ionic/react";
import "./ErrorMessage.css";

interface ErrorProps {
  title: string;
  subtitle: string;
}

const ErrorMessage: React.FC<ErrorProps> = ({ children, title, subtitle }) => {
  return (
    <div className="container">
      <img alt="" className="error-image" src="/assets/images/tubero-sad.svg" />
      <div className="message-container">
        <IonText color="primary">
          <h2>{title}</h2>
        </IonText>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default ErrorMessage;
