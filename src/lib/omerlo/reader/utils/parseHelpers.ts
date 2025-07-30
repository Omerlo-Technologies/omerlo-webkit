export function buildMeta(locale: string | null) {
  if (!locale) {
    return {
      locales: {
        available: ['en'],
        current: 'en'
      }
    };
  }

  return {
    locales: {
      available: [locale],
      current: locale
    }
  };
}

export function parseDate(input?: string | null): Date | null {
  if (!input) return null;
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
}
