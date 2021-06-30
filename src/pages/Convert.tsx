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

import axios from "axios";

import ErrorMessage from "../components/ErrorMessage";
import VideoCard from "../components/VideoCard";
import "./Convert.css";

type InfoResponse = {
  error?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
};

type ConvertQuery = {
  v: string;
  fmt: "audio" | "video";
  mw: boolean;
};

async function getInfo(v: string): Promise<InfoResponse> {
  const response = await axios.get<InfoResponse>(
    `${process.env.REACT_APP_BACKEND_ADDRESS || ""}/info?v=${v}`,
    { timeout: 8000 }
  );
  if (response.status !== 200 && response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data;
}

function download(id: string) {
  const link = document.createElement("a");
  link.href = `${
    process.env.REACT_APP_BACKEND_ADDRESS || ""
  }/download?id=${id}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function convert(
  query: ConvertQuery,
  onProgress: (percent: number) => void
) {
  const sse = new EventSource(
    `${process.env.REACT_APP_BACKEND_ADDRESS || ""}/convert?v=${query.v}&fmt=${
      query.fmt
    }&mw=${query.mw}`
  );

  await new Promise<void>((resolve) => {
    sse.addEventListener("progress", (event) => {
      const mevent = event as MessageEvent;
      const pevent = JSON.parse(mevent.data) as {
        percent: number;
      };

      onProgress(pevent.percent);
    });

    sse.addEventListener("success", (event) => {
      const mevent = event as MessageEvent;
      const pevent = JSON.parse(mevent.data) as {
        id: string;
      };

      download(pevent.id);
    });

    sse.addEventListener("error", (event) => {
      const mevent = event as MessageEvent;
      const pevent = JSON.parse(mevent.data) as {
        error: string;
      };

      console.log(pevent.error);
    });
  });
}

interface ConvertPageProps extends RouteComponentProps<{ v: string }> {}
const Convert: React.FC<ConvertPageProps> = ({ match }) => {
  const [videoInfo, setVideoInfo] = useState({} as InfoResponse);
  const [conversionPercent, setConversionPercent] = useState(0.0);

  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);

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
                    onClick={() => {
                      convert(
                        { v: match.params.v, fmt: "audio", mw: true },
                        (percent) => {
                          setConversionPercent(percent);
                        }
                      );
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

        <IonLoading isOpen={showLoading} message={"Loading"} />
      </IonContent>
    </IonPage>
  );
};

export default Convert;
