import type { GeoCodeResponse } from "@/api/types";
import { useFavourites } from "@/hooks/useFavourites";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
interface FavouriteButtonProps {
  data: GeoCodeResponse;
}
const FavouriteButton = ({ data }: FavouriteButtonProps) => {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();
  const isCityFavourite = isFavourite(`${data?.lat}-${data?.lon}`);
  function handleAddFavourite() {
    if (isCityFavourite) {
      removeFavourite.mutate({
        id: `${data?.lat}-${data?.lon}`,
        name: data?.name,
      });
    } else {
      addFavourite.mutate({
        lat: data?.lat,
        lon: data?.lon,
        name: data?.name,
        country: data?.country,
        state: data?.state,
      });
    }
  }
  return (
    <Button
      onClick={handleAddFavourite}
      size={"icon"}
      variant={isCityFavourite ? "default" : "outline"}
      className={isCityFavourite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
    >
      <Star className={`size-4 ${isCityFavourite ? "fill-current" : " "}`} />
    </Button>
  );
};

export default FavouriteButton;
