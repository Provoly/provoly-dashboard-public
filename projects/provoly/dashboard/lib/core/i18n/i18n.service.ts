import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { deepMerge } from './deep-merge.function';
import { enTranslations } from './en.translations';
import { frTranslations } from './fr.translations';

export type LangObject = { [obj: string]: LangObject | string };

export type Translation = { [key: string]: string | Translation };

@Injectable({
  providedIn: 'root'
})
export class PryI18nService {
  static warn = true;
  langObjects = {
    fr: {},
    en: {}
  } as { [lang: string]: { [obj: string]: Object } };
  currentLang = 'en';
  parameterRegexp = new RegExp(/{{(.*?)}}/gm);

  translations$ = new BehaviorSubject<Translation>({});

  constructor() {
    // @ts-ignore
    this.currentLang = (navigator.language || navigator.userLanguage).split('-')[0];
  }

  updateTranslations() {
    this.translations$.next({});
    Object.values(this.langObjects[this.currentLang]).forEach((obj) =>
      this.translations$.next(deepMerge(obj, this.translations$.getValue()))
    );
  }

  use(lang: string) {
    if (this.langObjects[lang]) {
      this.currentLang = lang;
    } else {
      console.error(`Lang ${lang} is not available. Choose amongst ${Object.keys(this.langObjects)}.`);
      this.currentLang = 'en';
    }
    this.updateTranslations();
  }

  addCoreTranslations() {
    this.addLangObject('fr', 'core', frTranslations);
    this.addLangObject('en', 'core', enTranslations);
  }

  addLangObject(lang: string, type: string, obj: Object) {
    if (!this.langObjects[lang]) {
      this.langObjects[lang] = {};
    }
    this.langObjects[lang][type] = deepMerge(this.langObjects[lang][type] ?? {}, obj);
    this.updateTranslations();
  }

  instantObject(key: string, params?: { [key: string]: any }): any {
    const keySplit = key.split('.');
    let response = this.translations$.getValue() as LangObject | string;
    for (let i = 0; i < keySplit.length; i++) {
      if (response && typeof response !== 'string') {
        response = response[keySplit[i]];
      }
    }
    return response;
  }

  instant(key: string, params?: { [key: string]: any }): string {
    let response = this.instantObject(key, params);
    if (typeof response === 'string') {
      const matches = response.match(this.parameterRegexp);
      matches?.forEach((match) => {
        const matchParam = match.substring(2, match.length - 2);
        const replaceRegexp = new RegExp(match, 'g');
        const valueOfParam = params ? params[matchParam] : match;
        if (valueOfParam !== undefined) {
          response = (response as string).replace(replaceRegexp, valueOfParam);
        }
      });
      return response as string;
    } else {
      if (PryI18nService.warn) {
        console.warn(`Key ${key} has not been found in translations for lang ${this.currentLang}.`);
      }
      return key;
    }
  }

  get(key: string, params?: { [key: string]: any }): Observable<string> {
    return this.translations$.pipe(map((translations) => this.instant(key, params)));
  }
}
