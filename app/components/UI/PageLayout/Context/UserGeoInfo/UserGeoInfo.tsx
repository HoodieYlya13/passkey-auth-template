import GeoFallbackFetcher from "./GeoFallbackFetcher";
import { getUserCountry, getUserIp } from "@/utils/cookies/cookies.server";

export default async function UserGeoInfo() {
  const userIp = await getUserIp();
  const userCountry = await getUserCountry();

  if (!userIp || !userCountry) return <GeoFallbackFetcher />;

  return null;
}
