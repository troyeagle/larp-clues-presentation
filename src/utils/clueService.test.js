describe('built-in clues under both deployment prefixes', () => {
  const originalUrl = process.env.PUBLIC_URL;
  const originalFetch = global.fetch;
  afterEach(() => {
    if (originalUrl === undefined) delete process.env.PUBLIC_URL;
    else process.env.PUBLIC_URL = originalUrl;
    global.fetch = originalFetch;
    jest.resetModules();
  });
  test.each(['/larp-clues-presentation', '/clue'])('resolves manifest, data and images beneath %s', async (prefix) => {
    process.env.PUBLIC_URL = prefix;
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ clues: [{ folder: 'a1', path: '/clues/a1/clue.json' }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ name: 'A1', back: 'a1u.png', front: 'a1d.png' }) });
    const { fetchBuiltInClues } = require('./clueService');
    const clues = await fetchBuiltInClues();
    expect(global.fetch).toHaveBeenNthCalledWith(1, `${prefix}/clues/manifest.json`);
    expect(global.fetch).toHaveBeenNthCalledWith(2, `${prefix}/clues/a1/clue.json`);
    expect(clues[0].aboveImage).toBe(`${prefix}/clues/a1/a1u.png`);
    expect(clues[0].belowImage).toBe(`${prefix}/clues/a1/a1d.png`);
  });
});
