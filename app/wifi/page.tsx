import { WifiPortal } from "@/components/wifi/WifiPortal";
import { firstSearchParam } from "@/lib/utils";
import type { CaptivePortalParams } from "@/lib/captive";

const DEFAULT_ARUBA_ACTION =
  "http://securelogin.arubanetworks.com/swarm.cgi";

type WifiPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function WifiPage({ searchParams }: WifiPageProps) {
  const captive: CaptivePortalParams = {
    mac: firstSearchParam(searchParams.mac),
    ip: firstSearchParam(searchParams.ip),
    apname: firstSearchParam(searchParams.apname),
    url: firstSearchParam(searchParams.url),
  };

  const arubaAction =
    process.env.NEXT_PUBLIC_ARUBA_ACTION ?? DEFAULT_ARUBA_ACTION;
  const arubaUser = process.env.ARUBA_USER ?? "guest";
  const arubaPassword = process.env.ARUBA_PASSWORD ?? "";

  return (
    <WifiPortal
      captive={captive}
      arubaAction={arubaAction}
      arubaUser={arubaUser}
      arubaPassword={arubaPassword}
    />
  );
}
