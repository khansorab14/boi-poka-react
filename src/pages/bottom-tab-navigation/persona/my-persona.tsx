import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";
import StatCards from "./stats-card";
import PersonaHeader from "./persona-header";
import PersonaRadarChart from "./persona-radar-chart";
import PersonaDistributionBar from "./persona-distributer-bar";
import GenreDistribution from "./genre-distribution";

import { LoaderCircle } from "lucide-react";
import AuthorChart from "./author-chart";

const MyPersona = () => {
  const [analytics, setAnalytics] = useState(null);
  const [content, setContent] = useState(null);
  const [genreDistribution, setGenereDistribution] = useState();
  const [authorData, setAuthorData] = useState();
  const [loading, setLoading] = useState(true); // NEW loading state

  useEffect(() => {
    const fetchMyPersona = async () => {
      try {
        const [analyticsRes, contentRes] = await Promise.all([
          axiosInstance.get("/user/getAnalytics"),
          axiosInstance.get("/user/getReadingPersona"),
        ]);

        setAuthorData(analyticsRes.data.data.booksByAuthorOrigin);
        setGenereDistribution(analyticsRes.data.data.genrePercentages);
        setAnalytics(analyticsRes.data.data);
        setContent(contentRes.data.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchMyPersona();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* You can replace this with a spinner component */}
        <LoaderCircle />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center my-24 items-center p-6">
      <PersonaHeader />

      {analytics && <StatCards analytics={analytics} />}

      {content && (
        <>
          <PersonaRadarChart content={content} />
          {analytics && <PersonaDistributionBar analytics={analytics} />}
        </>
      )}

      <GenreDistribution genreDistribution={genreDistribution} />
      <AuthorChart authorData={authorData} />
    </div>
  );
};

export default MyPersona;
