function encodeSvg(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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
  <text x="84" y="360" fill="#ffffff" font-size="160" font-family="Arial, sans-serif" font-weight="800">${initials}</text>
  <text x="84" y="430" fill="#d8efff" font-size="48" font-family="Arial, sans-serif" font-weight="700">${name}</text>
  <text x="84" y="490" fill="#c8e9ff" font-size="30" font-family="Arial, sans-serif">${subtitle}</text>
</svg>`;
  return encodeSvg(svg);
}

function isGenericStockImage(url: string) {
  return /picsum\.photos|images\.unsplash\.com|lh3\.googleusercontent\.com\/aida-public/i.test(url);
}

export function getCollegeImageUrl(
  slug: string,
  imageUrl?: string | null,
  name?: string,
  stream?: string,
  city?: string
) {
  if (imageUrl && imageUrl.trim().length > 0 && !isGenericStockImage(imageUrl)) {
    return imageUrl;
  }
  return getCollegeFallbackImageDataUri(name || slug, stream, city);
}
