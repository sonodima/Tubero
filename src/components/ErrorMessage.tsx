import { IonImg, IonText } from "@ionic/react";
import "./ErrorMessage.css";

interface ErrorProps {
  title: string;
  subtitle: string;
}

const ErrorMessage: React.FC<ErrorProps> = (props) => {
  return (
    <div className="container">
      <IonImg
        className="error-image"
        src="/assets/images/tubero-sad-fill-simple.svg"
      />
      <IonText color="primary">
        <h2>{props.title}</h2>
      </IonText>

      <p>{props.subtitle}</p>
      {props.children}
    </div>
  );
};

export default ErrorMessage;
