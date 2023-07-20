import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  notificationFeatureKey,
  PryCoreModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule
} from '@provoly/dashboard';
import { PrySearchModule } from '@provoly/dashboard/search';
import { PryNotificationContentComponent } from './components/notification/content/notification-content.component';
import { PryNotificationComponent } from './components/notification/notification.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { NotificationEffects } from './store/notification.effects';
import { notificationReducer } from './store/notification.reducer';
import { PryNotificationCssComponent } from './style/css.component';

@NgModule({
  imports: [
    CommonModule,
    PryCoreModule,
    StoreModule.forFeature(notificationFeatureKey, notificationReducer),
    EffectsModule.forFeature([NotificationEffects]),
    PryIconModule,
    PrySearchModule,
    PryI18nModule
  ],
  declarations: [PryNotificationComponent, PryNotificationContentComponent, PryNotificationCssComponent],
  exports: [PryNotificationComponent, PryNotificationContentComponent]
})
export class PryNotificationModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'notification', frTranslations);
    this.pryTranslateService.addLangObject('en', 'notification', enTranslations);
  }
}
