import React, { useEffect, useState } from "react";
import axios from "axios";

const DataFetcher: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <div>{data ? <p>{data.message}</p> : <p>Loading...</p>}</div>;
};

export default DataFetcher;
