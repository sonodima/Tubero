import axios from "axios";

import InfoResponse from "../types/InfoResponse";

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

export default getInfo;
