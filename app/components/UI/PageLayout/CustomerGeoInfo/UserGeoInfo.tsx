import GeoFallbackFetcher from "./GeoFallbackFetcher";
import { getUserCountryServer, getUserIp } from "@/utils/cookies/cookiesServer";

export default async function UserGeoInfo() {
  const userIp = await getUserIp();
  const userCountry = await getUserCountryServer();

  if (!userIp || !userCountry) return <GeoFallbackFetcher />;

  return null;
}
