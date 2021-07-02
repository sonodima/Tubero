import axios from "axios";

import SearchResponse from "../types/SearchResponse";

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

export default search;
