import ConvertQuery from "../types/ConvertQuery";

class Conversion {
  sse?: EventSource;
  id?: string;
  onProgress?: (percent: number) => void;
  resolver?: () => void;

  public async convert(query: ConvertQuery): Promise<void> {
    this.sse = new EventSource(
      `${process.env.REACT_APP_BACKEND_ADDRESS || ""}/convert?v=${
        query.v
      }&fmt=${query.fmt}&mw=${query.mw}`
    );

    const error = await new Promise<string | void>((resolve) => {
      this.resolver = resolve;

      this.sse!.addEventListener("progress", (event) => {
        const mevent = event as MessageEvent;
        const pevent = JSON.parse(mevent.data) as {
          percent: number;
        };

        if (this.onProgress) {
          this.onProgress(pevent.percent);
        }
      });

      this.sse!.addEventListener("success", (event) => {
        const mevent = event as MessageEvent;
        const pevent = JSON.parse(mevent.data) as {
          id: string;
        };

        this.sse!.close();
        this.id = pevent.id;
        resolve();
      });

      this.sse!.addEventListener("error", (event) => {
        const mevent = event as MessageEvent;
        const pevent = JSON.parse(mevent.data) as {
          error: string;
        };

        this.sse!.close();
        resolve(pevent.error);
      });
    });

    if (error) {
      throw new Error(error);
    }
  }

  public abort() {
    this.sse!.close();
    if (this.resolver) {
      this.resolver();
    }
  }

  public download() {
    if (this.id) {
      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_BACKEND_ADDRESS || ""}/download?id=${
        this.id
      }`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }
}

export default Conversion;
