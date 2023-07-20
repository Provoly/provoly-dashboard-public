import { PryI18nService } from './i18n.service';

describe('PryTranslateService', () => {
  let translateService: PryI18nService;

  beforeEach(() => {
    translateService = new PryI18nService();
    translateService.addCoreTranslations();
  });

  describe('instant function', () => {
    it('should allows translation', () => {
      expect(translateService.instant('@pry.widget.settings.title')).toEqual('Settings');
    });

    it('should allows translation in other than default language', () => {
      translateService.use('fr');
      expect(translateService.instant('@pry.widget.settings.title')).toEqual('Paramétrage');
    });

    it('should ignore non provided parameters', () => {
      expect(translateService.instant('@pry.widget.unrecognized', {})).toEqual(
        'Restitution of type {{type}} is unknown.'
      );
    });

    it('should allow substituting parameters', () => {
      expect(translateService.instant('@pry.widget.unrecognized', { type: 12 })).toEqual(
        'Restitution of type 12 is unknown.'
      );
    });
  });
});
