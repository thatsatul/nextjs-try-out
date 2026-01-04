import { 
  getLocaleFromPathname, 
  stripLocaleFromPathname, 
  addLocaleToPathname, 
  isValidLocale,
  getPreferredLocale 
} from '@/utils/locale';

describe('Locale Utils', () => {
  describe('isValidLocale', () => {
    it('returns true for valid locales', () => {
      expect(isValidLocale('en')).toBe(true);
      expect(isValidLocale('es')).toBe(true);
      expect(isValidLocale('fr')).toBe(true);
      expect(isValidLocale('de')).toBe(true);
    });

    it('returns false for invalid locales', () => {
      expect(isValidLocale('invalid')).toBe(false);
      expect(isValidLocale('jp')).toBe(false);
      expect(isValidLocale('')).toBe(false);
    });
  });

  describe('getLocaleFromPathname', () => {
    it('extracts locale from pathname', () => {
      expect(getLocaleFromPathname('/en')).toBe('en');
      expect(getLocaleFromPathname('/es/home')).toBe('es');
      expect(getLocaleFromPathname('/fr/test/page')).toBe('fr');
    });

    it('returns null for paths without locale', () => {
      expect(getLocaleFromPathname('/')).toBe(null);
      expect(getLocaleFromPathname('/home')).toBe(null);
      expect(getLocaleFromPathname('/invalid/home')).toBe(null);
    });
  });

  describe('stripLocaleFromPathname', () => {
    it('removes locale from pathname', () => {
      expect(stripLocaleFromPathname('/en')).toBe('/');
      expect(stripLocaleFromPathname('/es/home')).toBe('/home');
      expect(stripLocaleFromPathname('/fr/test/page')).toBe('/test/page');
    });

    it('returns original path if no locale', () => {
      expect(stripLocaleFromPathname('/home')).toBe('/home');
      expect(stripLocaleFromPathname('/')).toBe('/');
    });
  });

  describe('addLocaleToPathname', () => {
    it('adds locale to pathname', () => {
      expect(addLocaleToPathname('/home', 'es')).toBe('/es/home');
      expect(addLocaleToPathname('/test/page', 'fr')).toBe('/fr/test/page');
      expect(addLocaleToPathname('/', 'de')).toBe('/de');
    });
  });

  describe('getPreferredLocale', () => {
    it('returns default locale when no accept-language', () => {
      expect(getPreferredLocale()).toBe('en');
    });

    it('returns matching locale from accept-language', () => {
      expect(getPreferredLocale('es')).toBe('es');
      expect(getPreferredLocale('fr,en;q=0.9')).toBe('fr');
    });

    it('returns default locale for unsupported languages', () => {
      expect(getPreferredLocale('ja,zh;q=0.9')).toBe('en');
    });
  });
});
