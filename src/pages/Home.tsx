import { useState } from "react";
import {
  useIonLoading,
  useIonToast,
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { linkOutline } from "ionicons/icons";

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

  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast, dismissToast] = useIonToast();

  return (
    <IonPage>
      <IonHeader translucent>
        <CustomToolbar>
          <IonSearchbar
            value={query}
            onIonChange={(e) => setQuery(e.detail.value as string)}
            placeholder="Title or YouTube URL"
            searchIcon={linkOutline}
            animated={true}
            autocorrect="off"
            autoCapitalize="off"
            enterkeyhint="search"
            spellCheck="false"
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                presentLoading("Searching");
                try {
                  const results = await search(query);
                  setSearchResults(results);
                } catch (error) {
                  presentToast(error);
                }
                dismissLoading();
              }
            }}
          ></IonSearchbar>
        </CustomToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {searchResults.results?.map((result) => {
              return (
                <IonCol sizeMd="5" sizeLg="4" sizeXl="3">
                  <VideoCard
                    // url={`https://youtu.be/${result.v}`}
                    url={`/convert/${result.v}`}
                    title={result.title!}
                    author={result.author!}
                    thumbnail={result.thumbnail!}
                  />
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
        <GitHubButton />
      </IonContent>
    </IonPage>
  );
};

export default Home;
