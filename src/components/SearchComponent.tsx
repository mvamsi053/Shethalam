import { CircleX, History, Loader2, Search, Star } from "lucide-react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";
import { useState } from "react";
import { useGetSearchLocations } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import dayjs from "dayjs";
import { useFavourites } from "@/hooks/useFavourites";

const SearchComponent = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: locations, isLoading: locationsLoading } =
    useGetSearchLocations(query);

  const { addSearchItem, searchHistory, clearSearchHistory } =
    useSearchHistory();

  const { favourites } = useFavourites();

  const navigate = useNavigate();
  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country, state] = cityData.split("|");
    addSearchItem.mutate({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      country,
      query: query,
      state,
    });
    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div className='flex flex-col relative'>
      <Button
        variant='outline'
        className='relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
        onClick={() => setOpen(true)}
      >
        <Search /> Search cities
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='City search...'
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query?.length > 2 && !locationsLoading && (
            <CommandEmpty>No results found...</CommandEmpty>
          )}
          {/* Favorites */}
          {favourites.length > 0 && (
            <CommandGroup heading='Favorites'>
              {favourites.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Star className='mr-2 h-4 w-4' />
                  <span>{location.name}</span>
                  {location.state && (
                    <span className='text-sm text-muted-foreground'>
                      , {location.state}
                    </span>
                  )}
                  <span className='text-sm text-muted-foreground'>
                    , {location.country}
                  </span>
                  <CommandShortcut>
                    {dayjs(location?.timestamp).format("hh:mm A")}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup
                heading={
                  <div className='w-full flex items-center justify-between'>
                    <p>Recent Cities</p>
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      onClick={() => {
                        clearSearchHistory.mutate();
                      }}
                    >
                      <CircleX className='size-4' />
                    </Button>
                  </div>
                }
              >
                {searchHistory.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <History className='mr-2 h-4 w-4' />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className='text-sm text-muted-foreground'>
                        , {location.state}
                      </span>
                    )}
                    <span className='text-sm text-muted-foreground'>
                      , {location.country}
                    </span>
                    <CommandShortcut>
                      {dayjs(location?.timestamp).format("hh:mm A")}
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Search Results */}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading='Suggestions'>
              {locationsLoading && (
                <div className='flex items-center justify-center p-4'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              )}
              {locations?.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}|${location.state}`}
                  onSelect={handleSelect}
                >
                  <Search className='mr-2 h-4 w-4' />
                  <span>{location.name}</span>
                  {location.state && (
                    <span className='text-sm text-muted-foreground'>
                      , {location.state}
                    </span>
                  )}
                  <span className='text-sm text-muted-foreground'>
                    , {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchComponent;
