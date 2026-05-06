let builtInCache = null;

export async function fetchBuiltInClues() {
  if (builtInCache) return builtInCache;

  try {
    const res = await fetch('/clues/manifest.json');
    if (!res.ok) return [];
    const manifest = await res.json();

    const clues = await Promise.all(
      manifest.clues.map(async (entry) => {
        try {
          const clueRes = await fetch(entry.path);
          if (!clueRes.ok) return null;
          const data = await clueRes.json();

          const basePath = entry.path.substring(0, entry.path.lastIndexOf('/') + 1);

          return {
            id: `builtin_${entry.folder}`,
            name: data.name || entry.folder,
            aboveImage: basePath + data.back,
            belowImage: basePath + data.front,
            row: data.row || 3,
            column: data.column || 6,
            source: 'builtin',
          };
        } catch {
          return null;
        }
      })
    );

    builtInCache = clues.filter(Boolean);
    return builtInCache;
  } catch {
    return [];
  }
}
