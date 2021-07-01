import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import {
  IonLoading,
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from "@ionic/react";

import InfoResponse from "../types/InfoResponse";
import Conversion from "../core/Conversion";
import getInfo from "../core/getInfo";

import ErrorMessage from "../components/ErrorMessage";
import VideoCard from "../components/VideoCard";
import ConversionModal from "../components/ConversionModal";
import "./Convert.css";

const conversion = new Conversion();

interface ConvertPageProps extends RouteComponentProps<{ v: string }> {}
const Convert: React.FC<ConvertPageProps> = ({ match }) => {
  const [videoInfo, setVideoInfo] = useState({} as InfoResponse);
  const [conversionPercent, setConversionPercent] = useState(0.0);

  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);

  useEffect(() => {
    setVideoInfo({});
    (async () => {
      try {
        const info = await getInfo(match.params.v);
        setVideoInfo(info);
      } catch (error) {
        setErrorMessage(error.message);
      }
    })();
  }, [match.params.v]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>tubero</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          {errorMessage === "" ? (
            <div>
              <IonRow className="ion-justify-content-center">
                <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
                  <VideoCard
                    url={`https://youtu.be/${match.params.v}`}
                    isUrlExternal={true}
                    title={videoInfo.title}
                    author={videoInfo.author}
                    thumbnail={videoInfo.thumbnail}
                  />
                </IonCol>
              </IonRow>

              <IonRow className="ion-justify-content-center">
                <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
                  <IonButton
                    shape="round"
                    expand="block"
                    onClick={async () => {
                      setConversionPercent(0);
                      setShowConversionModal(true);

                      conversion.onProgress = (percent) => {
                        setConversionPercent(percent);
                      };

                      try {
                        await conversion.convert({
                          v: match.params.v,
                          fmt: "audio",
                          mw: true,
                        });

                        conversion.download();
                      } catch (error) {
                        setErrorMessage(error.message);
                      }

                      setShowConversionModal(false);
                    }}
                  >
                    Convert
                  </IonButton>
                </IonCol>
              </IonRow>
            </div>
          ) : (
            <ErrorMessage title="Oops" subtitle={errorMessage}>
              <IonButton
                shape="round"
                onClick={async () => {
                  setShowLoading(true);
                  try {
                    const info = await getInfo(match.params.v);
                    setVideoInfo(info);
                  } catch (error) {
                    setErrorMessage(error.message);
                  }
                  setShowLoading(false);
                }}
              >
                Retry
              </IonButton>
            </ErrorMessage>
          )}
        </IonGrid>

        <ConversionModal
          isOpen={showConversionModal}
          progress={conversionPercent}
          onCancel={() => {
            conversion.abort();
          }}
        />

        <IonLoading isOpen={showLoading} message={"Loading"} />
      </IonContent>
    </IonPage>
  );
};

export default Convert;
