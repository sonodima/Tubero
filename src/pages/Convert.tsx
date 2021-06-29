import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import {
  IonToast,
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,
  IonImg,
  IonText,
} from "@ionic/react";

import axios from "axios";

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
    { timeout: 4000 }
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

  const status = await new Promise<void>((resolve) => {
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

  useEffect(() => {
    (async () => {
      try {
        const info = await getInfo(match.params.v);
        setVideoInfo(info);
      } catch (error) {
        setErrorMessage(error.message);
      }
    })();
  });

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>tubero</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          {errorMessage !== "" && (
            <IonRow>
              <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
                <IonImg
                  className="error-image"
                  src="/assets/images/tubero-sad-fill-simple.svg"
                />
                <h2>Ooops, there has been an error</h2>
                <p>{errorMessage}</p>
                <IonButton color="transparent">Retry</IonButton>
              </IonCol>
            </IonRow>
          )}

          {videoInfo.title !== undefined && (
            <IonRow>
              <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
                <VideoCard
                  url={`https://youtu.be/${match.params.v}`}
                  title={videoInfo.title!}
                  author={videoInfo.author!}
                  thumbnail={videoInfo.thumbnail!}
                />
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
          )}

          <IonRow>
            <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
              <h1>{conversionPercent}</h1>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={errorMessage !== ""}
          onDidDismiss={() => setErrorMessage("")}
          message={errorMessage}
          position="top"
          buttons={[
            {
              text: "Retry",
              handler: async () => {
                try {
                  const info = await getInfo(match.params.v);
                  setVideoInfo(info);
                } catch (error) {
                  setErrorMessage(error.message);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Convert;
