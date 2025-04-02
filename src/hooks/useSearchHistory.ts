import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

interface SearchItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  timestamp: number;
}

export const useSearchHistory = () => {
  const queryClient = useQueryClient();
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchItem[]>(
    "searchHistory",
    []
  );

  const searchQuery = useQuery({
    queryKey: ["searchHistory", searchHistory],
    queryFn: () => searchHistory,
    initialData: searchHistory,
  });

  const addSearchItem = useMutation({
    mutationFn: async (item: Omit<SearchItem, "id" | "timestamp">) => {
      const newItem = {
        ...item,
        id: `${item?.lat}-${item?.lon}`,
        timestamp: Date.now(),
      };
      const finalItems = searchHistory
        .filter((item) => item.id !== newItem.id)
        ?.slice(0, 5);
      setSearchHistory([newItem, ...finalItems]);
      return [newItem, ...finalItems];
    },
    onSuccess: (newItems) => {
      queryClient.setQueryData(["searchHistory"], newItems);
    },
  });
  const clearSearchHistory = useMutation({
    mutationFn: async () => {
      setSearchHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["searchHistory"], []);
    },
  });
  return {
    searchHistory: searchQuery.data ?? [],
    addSearchItem,
    clearSearchHistory,
  };
};
