let builtInCache = null;

export async function fetchBuiltInClues() {
  if (builtInCache) return builtInCache;

  try {
    const publicUrl = process.env.PUBLIC_URL || '';
    const res = await fetch(`${publicUrl}/clues/manifest.json`);
    if (!res.ok) return [];
    const manifest = await res.json();

    const clues = await Promise.all(
      manifest.clues.map(async (entry) => {
        try {
          const fullEntryPath = publicUrl + entry.path;
          const clueRes = await fetch(fullEntryPath);
          if (!clueRes.ok) return null;
          const data = await clueRes.json();

          const basePath = fullEntryPath.substring(0, fullEntryPath.lastIndexOf('/') + 1);

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
