import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios-instance";

export const useFetchData = (url: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await axiosInstance.get(url);
      return response.data;
    },
  });

  return { data, isLoading, isError, error };
};

export const useFetchDataById = (url: string, id: string | number) => {
  return useQuery({
    queryKey: [url, id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${url}/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const usePostData = (url: string) => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(url, data);
      return response.data;
    },
    onError: (error) => {
      console.error("Error during POST request:", error);
    },
    onSuccess: (data) => {
      alert(JSON.stringify(data));
    },
  });
};

export const useUpdateData = (url: string) => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ id, data }: { id: string | number; data: any }) => {
      const response = await axiosInstance.put(`${url}/${id}`, data);
      return response.data;
    },
    onError: (error) => {
      console.error("Error during UPDATE request:", error);
    },
    onSuccess: (data) => {
      alert(JSON.stringify(data));
    },
  });
};

export const useDeleteData = (url: string) => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ id }: { id: string | number }) => {
      const response = await axiosInstance.delete(`${url}/${id}`);
      return response.data;
    },
    onError: (error) => {
      console.error("Error during DELETE request:", error);
    },
    onSuccess: (data) => {
      alert(JSON.stringify(data));
    },
  });
};
