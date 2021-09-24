import ConvertQuery from "../types/ConvertQuery";
import ProgressData from "../types/ProgressData";

class Conversion {
  sse?: EventSource;
  id?: string;
  onProgress?: (progress: ProgressData) => void;
  resolver?: (result: boolean) => void;

  public async convert(query: ConvertQuery): Promise<boolean> {
    this.sse = new EventSource(
      `${process.env.REACT_APP_BACKEND_ADDRESS || ""}/convert?v=${
        query.v
      }&fmt=${query.fmt}&mw=${query.mw}`
    );

    let error = "";
    const status = await new Promise<boolean>((resolve) => {
      this.resolver = resolve;

      this.sse!.addEventListener("progress", (event) => {
        const mevent = event as MessageEvent;
        const pevent = JSON.parse(mevent.data) as ProgressData;

        if (this.onProgress) {
          this.onProgress(pevent);
        }
      });

      this.sse!.addEventListener("success", async (event) => {
        const mevent = event as MessageEvent;
        const pevent = JSON.parse(mevent.data) as {
          id: string;
        };

        this.id = pevent.id;
        resolve(true);
      });

      this.sse!.addEventListener("error", (event) => {
        const mevent = event as MessageEvent;
        const pevent = JSON.parse(mevent.data) as {
          error: string;
        };

        this.sse!.close();
        error = pevent.error;
        resolve(false);
      });
    });

    if (error !== "") {
      throw new Error(error);
    }

    return status;
  }

  public abort() {
    this.sse!.close();
    if (this.resolver) {
      this.resolver(false);
    }
  }

  public download() {
    if (this.id) {
      const link = document.createElement("a");
      link.href = `${
        process.env.REACT_APP_BACKEND_ADDRESS || ""
      }/download?id=${encodeURI(this.id)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }
}

export default Conversion;
