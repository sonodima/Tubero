import { useState } from "react";
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
import axios from "axios";

import CustomToolbar from "../components/CustomToolbar";
import GitHubButton from "../components/GitHubButton";
import VideoCard from "../components/VideoCard";
import "./Home.css";

type SearchItem = {
  v?: string;
  title?: string;
  author?: string;
  thumbnail?: string | null;
};

type SearchResponse = {
  error?: string;
  corrected?: string;
  results?: SearchItem[];
};

async function search(query: string): Promise<SearchResponse> {
  const response = await axios.get<SearchResponse>(
    `${process.env.REACT_APP_BACKEND_ADDRESS || ""}/search?q=${query}`,
    { timeout: 4000 }
  );
  if (response.status !== 200 && response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data;
}

const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({} as SearchResponse);

  const [showLoading, setShowLoading] = useState(false);
  const [presentToast] = useIonToast();

  return (
    <IonPage>
      <IonHeader translucent>
        <CustomToolbar>
          <IonSearchbar
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
                setShowLoading(true);
                setSearchResults({});
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
