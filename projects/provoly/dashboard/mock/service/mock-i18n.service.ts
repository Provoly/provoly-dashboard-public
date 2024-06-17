import { of } from 'rxjs';

export class MockPryI18nService {
  updateTranslations = () => {};
  use = () => {};
  addCoreTranslations = () => {};
  addLangObject = () => {};
  instantObject = () => ({});
  instant = () => 'mock i18n translation';
  get = () => of('');
}
