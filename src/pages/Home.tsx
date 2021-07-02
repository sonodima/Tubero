import { useState, useRef } from "react";
import { useHistory } from "react-router";
import {
  useIonToast,
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
} from "@ionic/react";

import { motion } from "framer-motion";

import SearchResponse from "../types/SearchResponse";
import search from "../utils/search";
import getIdFromUrl from "../utils/getIdFromUrl";

import CustomToolbar from "../components/CustomToolbar";
import GitHubButton from "../components/GitHubButton";
import VideoCard from "../components/VideoCard";
import "./Home.css";

const Home: React.FC = () => {
  let history = useHistory();
  const searchBarRef = useRef<HTMLIonSearchbarElement>(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({} as SearchResponse);

  const [showLoading, setShowLoading] = useState(false);
  const [presentToast] = useIonToast();

  return (
    <IonPage>
      <IonHeader translucent>
        <CustomToolbar>
          <IonSearchbar
            ref={searchBarRef}
            value={query}
            onIonChange={(e) => setQuery(e.detail.value as string)}
            placeholder="Title or YouTube URL"
            animated={true}
            debounce={0}
            autocorrect="off"
            autoCapitalize="off"
            enterkeyhint="search"
            spellCheck="false"
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                setSearchResults({});

                const id = getIdFromUrl(query);
                if (!id) {
                  setShowLoading(true);
                  try {
                    const results = await search(query);
                    setSearchResults(results);
                  } catch (error) {
                    presentToast({
                      message: error.message,
                      duration: 2000,
                      position: "top",
                      buttons: [{ text: "Dismiss", handler: () => {} }],
                    });
                  }
                  setShowLoading(false);
                } else {
                  history.push(`/convert/${id}`);
                }
              }
            }}
          ></IonSearchbar>
        </CustomToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          {searchResults.results?.map((result) => (
            <motion.div
              key={result.v}
              layoutId={result.v}
              initial={{ opacity: 0, marginTop: 40 }}
              animate={{ opacity: 1, marginTop: 0 }}
              exit={{ opacity: 0, marginTop: 40 }}
            >
              <IonRow className="ion-justify-content-center">
                <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
                  <VideoCard
                    url={`/convert/${result.v}`}
                    title={result.title!}
                    author={result.author!}
                    thumbnail={result.thumbnail!}
                  />
                </IonCol>
              </IonRow>
            </motion.div>
          ))}
        </IonGrid>

        <GitHubButton />

        <IonLoading isOpen={showLoading} message="Loading" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
