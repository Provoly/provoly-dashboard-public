import { of } from 'rxjs';

export class MockPryI18nService {
  updateTranslations = () => {};
  use = () => {};
  addCoreTranslations = () => {};
  addLangObject = () => {};
  instantObject = () => ({});
  instant = (value: any) => value;
  get = () => of('');
}
