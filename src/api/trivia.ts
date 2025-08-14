import axios from "axios";

export const getTriviaReadStatus = async (
  startDate: string,
  endDate: string
) => {
  const res = await axios.post<any>("/api/user/getTriviaReadStatus", {
    startDate,
    endDate,
  });
  return res.data;
};

export const getTriviaById = async (triviaId: string) => {
  const res = await axios.get<any>(
    `/api/user/getTriviaById?triviaId=${triviaId}`
  );
  return res.data;
};
