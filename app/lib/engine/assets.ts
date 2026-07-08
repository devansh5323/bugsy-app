// Asset loader — preloads and caches images for canvas games so
// sprites are decoded before the RAF loop needs to drawImage them
// (loading mid-game causes a visible first-frame pop). Covers the
// inline-SVG-sprite pattern SnackCatchGame established with its bomb.
// See docs/GAME_ENGINE.md.

const cache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = cache.get(src);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("loadImage called during SSR"));
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Drop failed loads from the cache so a retry is possible.
      cache.delete(src);
      reject(new Error(`Failed to load image: ${src.slice(0, 120)}`));
    };
    img.src = src;
  });

  cache.set(src, promise);
  return promise;
}

// Load a named batch up front (typically in a game's mount effect,
// before flipping status to "playing").
export async function loadImages<K extends string>(
  sources: Record<K, string>,
): Promise<Record<K, HTMLImageElement>> {
  const names = Object.keys(sources) as K[];
  const images = await Promise.all(names.map((n) => loadImage(sources[n])));
  const out = {} as Record<K, HTMLImageElement>;
  names.forEach((n, i) => {
    out[n] = images[i];
  });
  return out;
}

// Inline-SVG sprites (crisp, tintable, no asset files) → data URL
// suitable for loadImage.
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
