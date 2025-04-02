import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";

interface FavouriteItem {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  timestamp: number;
}

export const useFavourites = () => {
  const queryClient = useQueryClient();
  const [favourites, setFavourites] = useLocalStorage<FavouriteItem[]>(
    "favourites",
    []
  );

  const favouriteQuery = useQuery({
    queryKey: ["favourites"],
    queryFn: () => favourites,
    initialData: favourites,
    staleTime: Infinity, // Since we're managing the data in localStorage
  });

  const addFavourite = useMutation({
    mutationFn: async (item: Omit<FavouriteItem, "id" | "timestamp">) => {
      const newItem: FavouriteItem = {
        ...item,
        id: `${item?.lat}-${item?.lon}`,
        timestamp: Date.now(),
      };
      const existingItem = favourites.some((item) => item.id === newItem.id);
      if (existingItem) {
        return favourites;
      }
      const finalItems = [newItem, ...favourites].slice(0, 10);
      setFavourites(finalItems);

      return finalItems;
    },
    onSuccess: (newItems) => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      toast.success(`Added ${newItems?.[0]?.name} to favourites`);
    },
  });
  const removeFavourite = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const finalItems = favourites.filter((item) => item.id !== id);
      setFavourites(finalItems);
      toast.error(`Removed ${name} from favourites`);
      return finalItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });

  const isFavourite = (favID: string) => {
    return favourites.some((item) => item.id === favID);
  };

  return {
    favourites: favouriteQuery.data ?? [],
    addFavourite,
    removeFavourite,
    isFavourite,
  };
};
