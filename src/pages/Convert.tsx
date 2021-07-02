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
  IonToggle,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { Storage } from "@ionic/storage";

import InfoResponse from "../types/InfoResponse";
import Conversion from "../core/Conversion";
import getInfo from "../utils/getInfo";

import ErrorMessage from "../components/ErrorMessage";
import VideoCard from "../components/VideoCard";
import ConversionModal from "../components/ConversionModal";
import "./Convert.css";

const conversion = new Conversion();
const store = new Storage();

interface ConvertPageProps extends RouteComponentProps<{ v: string }> {}
const Convert: React.FC<ConvertPageProps> = ({ match }) => {
  const [videoInfo, setVideoInfo] = useState({} as InfoResponse);
  const [errorMessage, setErrorMessage] = useState("");
  const [withMw, setWithMw] = useState(true);

  const [conversionPercent, setConversionPercent] = useState(0.0);

  const [showLoading, setShowLoading] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);

  useEffect(() => {
    (async () => {
      await store.create();

      const current = await store.get("mw");
      if (current === undefined) {
        await store.set("mw", true);
      } else {
        setWithMw(current);
      }
    })();
  }, []);

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
            <>
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

              <IonRow>
                <IonCol>
                  <IonToggle
                    checked={withMw}
                    onIonChange={(e) => {
                      store.set("mw", !withMw);
                      setWithMw(e.detail.checked);
                    }}
                  >
                    Test
                  </IonToggle>
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
                          mw: withMw,
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
            </>
          ) : (
            <ErrorMessage title="Oops" subtitle={errorMessage}>
              <IonButton
                shape="round"
                onClick={async () => {
                  setShowLoading(true);
                  try {
                    const info = await getInfo(match.params.v);
                    setVideoInfo(info);
                    setErrorMessage("");
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
