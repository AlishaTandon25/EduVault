function encodeSvg(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 4);
}

export function getCollegeFallbackImageDataUri(name: string, stream?: string, city?: string) {
  const initials = initialsFromName(name || "College");
  const subtitle = [stream, city].filter(Boolean).join(" • ");
  const safeInitials = escapeXml(initials);
  const safeName = escapeXml(name || "College");
  const safeSubtitle = escapeXml(subtitle);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b2d51"/>
      <stop offset="100%" stop-color="#1f6aa5"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#g)"/>
  <circle cx="1020" cy="120" r="220" fill="#ffffff12"/>
  <circle cx="150" cy="640" r="180" fill="#ffffff10"/>
  <text x="84" y="180" fill="#c8e9ff" font-size="36" font-family="Arial, sans-serif" font-weight="700">EduVault</text>
  <text x="84" y="360" fill="#ffffff" font-size="160" font-family="Arial, sans-serif" font-weight="800">${safeInitials}</text>
  <text x="84" y="430" fill="#d8efff" font-size="48" font-family="Arial, sans-serif" font-weight="700">${safeName}</text>
  <text x="84" y="490" fill="#c8e9ff" font-size="30" font-family="Arial, sans-serif">${safeSubtitle}</text>
</svg>`;
  return encodeSvg(svg);
}

function isGenericStockImage(url: string) {
  return /picsum\.photos|images\.unsplash\.com|lh3\.googleusercontent\.com\/aida-public/i.test(url);
}

function isValidHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isUnreliableExternalDomain(url: string) {
  // These sources frequently block cross-site hotlinking and show broken images in production.
  return /shiksha\.com/i.test(url);
}

export function getCollegeImageUrl(
  slug: string,
  imageUrl?: string | null,
  name?: string,
  stream?: string,
  city?: string,
  forceFallback?: boolean
) {
  if (forceFallback) {
    return getCollegeFallbackImageDataUri(name || slug, stream, city);
  }

  if (
    imageUrl &&
    imageUrl.trim().length > 0 &&
    isValidHttpUrl(imageUrl) &&
    !isGenericStockImage(imageUrl) &&
    !isUnreliableExternalDomain(imageUrl)
  ) {
    return imageUrl;
  }
  return getCollegeFallbackImageDataUri(name || slug, stream, city);
}
