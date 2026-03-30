export type CaptivePortalParams = {
  mac: string;
  ip: string;
  apname: string;
  url: string;
};

const PARAM_KEYS = ["mac", "ip", "apname", "url"] as const;

export type CaptiveParamKey = (typeof PARAM_KEYS)[number];

export function getMissingCaptiveKeys(params: CaptivePortalParams): CaptiveParamKey[] {
  return PARAM_KEYS.filter((key) => !params[key]?.trim());
}
