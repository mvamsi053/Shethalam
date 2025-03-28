import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const {
    // coordinates,
    getLocation,
    error: locationError,
    loading: locationLoading,
  } = useGeoLocation();
  console.log("dsfklsdf", locationLoading);
  function refetchLocation() {
    getLocation();
  }

  if (locationLoading) {
    return <div className='flex flex-auto '>Loading</div>;
  }

  if (locationError) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Oops</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p> {locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className='w-fit'>
            <MapPin className='mr-2 h-4 w-4' />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='cflex w-full flex-col flex-auto '>
      <div className='w-full flex items-center justify-between'>
        <p className='font-medium text-lg'>My Location</p>
        <Button size={"icon"} onClick={refetchLocation}>
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
