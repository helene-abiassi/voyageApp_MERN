import { useEffect, useState } from "react";

interface ReturnData<T> {
  data: null | T;
  loading: boolean;
}

interface ErrorResponse {
  error: string;
}

function useMyFetch<T>(url: string): ReturnData<T> {
  const [data, setData] = useState<null | T>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);

      if (response.ok) {
        const results = (await response.json()) as T;
        setData(results);
        setLoading(false);
      } else {
        const results = (await response.json()) as ErrorResponse;
        setError(results.error);
      }
    } catch (err) {
      console.log("error in useMyFetch hook :>> ", err);
      const { message } = err as Error;
      setError(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(url)
      .catch((err) => {
        console.log("error in useMyFetch hook :>> ", err);
        const { message } = err as Error;
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  const returnObject = {
    data: data,
    error: error,
    loading: loading,
  };

  return returnObject;
}

export default useMyFetch;
