import { Loader2, Search } from "lucide-react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useState } from "react";
import { useGetSearchLocations } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: locations, isLoading: locationsLoading } =
    useGetSearchLocations(query);
  console.log("sdlkflsdkf", locations?.length);
  const navigate = useNavigate();
  const handleSelect = (cityData: string) => {
    const [lat, lon, name] = cityData.split("|");

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant='outline'
        className='flex items-center gap-x-2 text-muted-foreground  w-[14rem] relative'
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
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
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
    </>
  );
};

export default SearchComponent;
