"use client";
import React, { useEffect } from "react";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
};

type FetchResult = {
  limit: number;
  skip: number;
  total: number;
  users: User[];
};

export const useFetch = (url: string, options?: Record<string, unknown>) => {
  const [data, setData] = React.useState<FetchResult | null>(null);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (!url) {
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      setLoading(true);

      try {
        const res = await fetch(url, {
          ...options,
          signal,
        });

        if (!res.ok) {
          setError(`HTTP error! status: ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = (await res.json()) as FetchResult;

        setData(result);
        setLoading(false);
      } catch (err: unknown) {
        setError(`Error fetching data: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, error, loading };
};
