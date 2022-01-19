import { isPlainObject } from "lodash-es";
import { theGlobal } from "./Global";

export function flaxFetch<ResponseDataType = object>(
  url: string,
  options: FlaxFetchOptions = {}
): CancelablePromise<ResponseDataType> {
  if (isPlainObject(options?.body) && !(options?.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
    options.headers = options.headers || {};
    options.headers["content-type"] = "application/json";
  }
  const ac = new AbortController();
  options.signal = ac.signal;

  const fetchPromise = fetch(url, options as RequestInit).then((r) => {
    if (r.ok) {
      if (r.status === 204) {
        return;
      } else if (r.headers.get("content-type")?.includes("application/json")) {
        return r.json();
      } else if (r.headers.get["content-length"]?.length > 0) {
        return r.text();
      }
    } else if (r.status === 401) {
      window.location.assign("/login");
    } else {
      const err = new FetchError(
        `Server responded with ${r.status} ${r.statusText} when requesting ${
          options?.method ?? "GET"
        } ${url}`
      );

      const bodyMethod = r.headers
        .get("content-type")
        ?.includes("application/json")
        ? "json"
        : "text";

      return r[bodyMethod]().then((body) => {
        err.body = body;
        throw err;
      });
    }
  }) as CancelablePromise<ResponseDataType>;
  fetchPromise.cancel = () => {
    ac.abort();
  };
  return fetchPromise;
}

interface CancelablePromise<PromiseResult> extends Promise<PromiseResult> {
  cancel: () => void;
}

export type FlaxFetchOptions = Omit<RequestInit, "body"> & {
  body?: object | BodyInit;
};

export class FetchError<ResponseBody = string | object | void> extends Error {
  body: ResponseBody;
}

declare global {
  interface Window {
    debugFetch: typeof flaxFetch;
  }

  namespace NodeJS {
    interface Global {
      debugFetch: typeof flaxFetch;
    }
  }
}

theGlobal.debugFetch = flaxFetch;
