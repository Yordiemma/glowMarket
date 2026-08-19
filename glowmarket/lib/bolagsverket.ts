const TEST_TOKEN_URL = "https://portal-accept2.api.bolagsverket.se/oauth2/token";
const TEST_BASE_URL = "https://gw-accept2.api.bolagsverket.se/vardefulla-datamangder/v1";
const REQUEST_TIMEOUT_MS = 10_000;

type TokenResponse = { access_token?: string; expires_in?: number };
type RegistryError = { typ?: string; felBeskrivning?: string };
type RegistryOrganisation = {
  organisationsidentitet?: { identitetsbeteckning?: string };
  organisationsnamn?: {
    organisationsnamnLista?: Array<{
      namn?: string;
      organisationsnamntyp?: { kod?: string };
    }>;
    fel?: RegistryError | null;
  };
  organisationsform?: { kod?: string; klartext?: string; fel?: RegistryError | null };
};
type RegistryResponse = { organisationer?: RegistryOrganisation[] };

let cachedToken: { value: string; expiresAt: number } | null = null;

export class BolagsverketConfigurationError extends Error {}
export class BolagsverketAuthenticationError extends Error {}
export class BolagsverketUnavailableError extends Error {}

function requiredEnvironment() {
  const clientId = process.env.BOLAGSVERKET_CLIENT_ID?.trim();
  const clientSecret = process.env.BOLAGSVERKET_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new BolagsverketConfigurationError("Bolagsverket credentials are not configured.");
  }

  return {
    clientId,
    clientSecret,
    tokenUrl: process.env.BOLAGSVERKET_TOKEN_URL?.trim() || TEST_TOKEN_URL,
    baseUrl: (process.env.BOLAGSVERKET_BASE_URL?.trim() || TEST_BASE_URL).replace(/\/$/, ""),
  };
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  const { clientId, clientSecret, tokenUrl } = requiredEnvironment();

  let response: Response;
  try {
    response = await fetchWithTimeout(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "vardefulla-datamangder:read",
      }),
    });
  } catch {
    throw new BolagsverketUnavailableError("The registry token service could not be reached.");
  }

  if (!response.ok) throw new BolagsverketAuthenticationError("Bolagsverket rejected the test credentials.");
  const token = await response.json().catch(() => null) as TokenResponse | null;
  if (!token?.access_token) throw new BolagsverketAuthenticationError("Bolagsverket returned an invalid token response.");

  const lifetimeSeconds = Math.max(30, token.expires_in ?? 300);
  cachedToken = { value: token.access_token, expiresAt: Date.now() + (lifetimeSeconds - 15) * 1000 };
  return token.access_token;
}

function primaryName(organisation: RegistryOrganisation) {
  const names = organisation.organisationsnamn?.organisationsnamnLista ?? [];
  return names.find((entry) => entry.organisationsnamntyp?.kod === "FORETAGSNAMN")?.namn
    ?? names[0]?.namn
    ?? null;
}

export async function findTestBusiness(organisationNumber: string) {
  const token = await getAccessToken();
  const { baseUrl } = requiredEnvironment();
  let response: Response;
  try {
    response = await fetchWithTimeout(`${baseUrl}/organisationer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Request-Id": crypto.randomUUID(),
      },
      body: JSON.stringify({ identitetsbeteckning: organisationNumber }),
    });
  } catch {
    throw new BolagsverketUnavailableError("The test registry could not be reached.");
  }

  if (response.status === 401 || response.status === 403) {
    cachedToken = null;
    throw new BolagsverketAuthenticationError("The credentials do not have access to the company API.");
  }
  if (response.status >= 500) throw new BolagsverketUnavailableError("The test registry is temporarily unavailable.");
  if (!response.ok) return null;

  const payload = await response.json().catch(() => null) as RegistryResponse | null;
  const organisation = payload?.organisationer?.[0];
  if (!organisation || organisation.organisationsnamn?.fel?.typ === "ORGANISATION_FINNS_EJ") return null;

  return {
    organisationNumber: organisation.organisationsidentitet?.identitetsbeteckning ?? organisationNumber,
    name: primaryName(organisation),
    organisationForm: organisation.organisationsform?.klartext ?? organisation.organisationsform?.kod ?? null,
  };
}

export function normalizeOrganisationNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidSwedishOrganisationNumber(value: string) {
  const digits = normalizeOrganisationNumber(value);
  if (!/^\d{10}$/.test(digits) || Number(digits[2]) < 2) return false;
  const sum = digits.split("").reduce((total, character, index) => {
    const product = Number(character) * (index % 2 === 0 ? 2 : 1);
    return total + Math.floor(product / 10) + (product % 10);
  }, 0);
  return sum % 10 === 0;
}
