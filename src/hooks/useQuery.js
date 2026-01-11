import { useQuery } from "@tanstack/react-query";
import api from "../api/api";


export const useFetchMyShortUrls = (token, onError) => {
    return useQuery({
        queryKey: ["my-shortenurls", token],
        queryFn: async () => {
            return await api.get(
                "/api/urls/myurls",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    },
                 }
            );
         }, 
           
            select: (data) => {
                const sortedData = data.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                return sortedData;

            },
            onError,
            staleTime: 0,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchInterval: false,
         
    });
};

export const useFetchTotalClicks = (token, onError) => {
    return useQuery({
        queryKey: ["url-totalclick", token],
        queryFn: async () => {
            return await api.get(
                "/api/urls/totalClicks?startDate=2026-01-01&endDate=2027-12-31",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                    },
                 }
            );
         }, 
           
            select: (data) => {
                const convertToArray = Object.keys(data.data).map((key) => {
                    return {
                        clickDate: key,
                        count: data.data[key],
                    }
                });
                return convertToArray;

            },
            onError,
            staleTime: 0, 
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchInterval: false,
         
    });
};