import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PryAccessDirective } from './access/access.directive';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from './access/access.guard';
import { PRY_ACCESS_TOKEN, PryDefaultAccessService } from './access/access.service';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { BaseMenuComponent } from './components/base-menu/base-menu.component';
import { BaseToolboxActionComponent } from './components/base-toolbox-action/base-toolbox-action.component';
import { BaseToolboxComponent } from './components/base-toolbox/base-toolbox.component';
import { GetSecuredImagePipe } from './components/get-secured-image/get-secured-image.pipe';
import { PryIconModule } from './components/icon/icon.module';
import { PryModalStatusModule } from './components/modalStatus/modalStatus.module';
import { PryNqColorSelectorComponent } from './components/nq-color-selector/nq-color-selector.component';
import { PryOverlayModule } from './components/overlay/overlay.module';
import { PrySelectImageComponent } from './components/select-image/select-image.component';
import { TranslateIdPipe } from './components/translate-id/translate-id.pipe';
import { TranslateItemToSymbolPipe } from './components/translate-item-to-symbol/translate-item-to-symbol.pipe';
import { PryUploadComponent } from './components/upload/upload.component';
import { PryI18nModule } from './i18n/i18n.module';
import { PryI18nService } from './i18n/i18n.service';
import { CategoryEffects } from './store/category/category.effects';
import { categoriesFeatureKey, categoryReducer } from './store/category/category.reducer';
import { ClassEffects } from './store/class/class.effects';
import { classesFeatureKey, classReducer } from './store/class/class.reducer';
import { ConfigEffects } from './store/config/config.effects';
import { configFeatureKey, configReducer } from './store/config/config.reducer';
import { ContextMenuEffects } from './store/context-menu/context-menu.effects';
import { contextMenuFeatureKey, contextMenuReducer } from './store/context-menu/context-menu.reducer';
import { DataSourceEffects } from './store/data-source/data-source.effects';
import { dataSourceFeatureKey, dataSourceReducer } from './store/data-source/data-source.reducer';
import { FieldEffects } from './store/field/field.effects';
import { fieldReducer, fieldsFeatureKey } from './store/field/field.reducer';
import { ImageEffects } from './store/image/image.effects';
import { imageFeatureKey, imageReducer } from './store/image/image.reducer';
import { ItemEffects } from './store/item/item.effects';
import { RelationTypesEffects } from './store/relation-types/relation-types.effects';
import { relationTypeReducer, relationTypesFeatureKey } from './store/relation-types/relation-types.reducer';
import { SearchEffects } from './store/search/search.effects';
import { searchFeatureKey, searchReducer } from './store/search/search.reducer';

@NgModule({
  declarations: [
    TranslateIdPipe,
    TranslateItemToSymbolPipe,
    GetSecuredImagePipe,
    BaseLayoutComponent,
    BaseMenuComponent,
    BaseToolboxComponent,
    BaseToolboxActionComponent,
    PryNqColorSelectorComponent,
    PryAccessDirective,
    PryUploadComponent,
    PrySelectImageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    StoreModule.forFeature(searchFeatureKey, searchReducer),
    StoreModule.forFeature(dataSourceFeatureKey, dataSourceReducer),
    StoreModule.forFeature(configFeatureKey, configReducer),
    StoreModule.forFeature(fieldsFeatureKey, fieldReducer),
    StoreModule.forFeature(classesFeatureKey, classReducer),
    StoreModule.forFeature(imageFeatureKey, imageReducer),
    StoreModule.forFeature(categoriesFeatureKey, categoryReducer),
    StoreModule.forFeature(contextMenuFeatureKey, contextMenuReducer),
    StoreModule.forFeature(relationTypesFeatureKey, relationTypeReducer),
    EffectsModule.forFeature([FieldEffects, ImageEffects]),
    EffectsModule.forFeature([ClassEffects]),
    EffectsModule.forFeature([ConfigEffects]),
    EffectsModule.forFeature([CategoryEffects]),
    EffectsModule.forFeature([ContextMenuEffects]),
    EffectsModule.forFeature([SearchEffects]),
    EffectsModule.forFeature([DataSourceEffects]),
    EffectsModule.forFeature([RelationTypesEffects]),
    EffectsModule.forFeature([ItemEffects]),
    PryIconModule,
    OverlayModule,
    PryOverlayModule,
    PryI18nModule,
    PryModalStatusModule
  ],
  providers: [AsyncPipe, TranslateIdPipe, TranslateItemToSymbolPipe],
  exports: [
    TranslateIdPipe,
    TranslateItemToSymbolPipe,
    GetSecuredImagePipe,
    BaseLayoutComponent,
    BaseMenuComponent,
    BaseToolboxComponent,
    PryNqColorSelectorComponent,
    PryAccessDirective,
    PryUploadComponent,
    PrySelectImageComponent
  ]
})
export class PryCoreModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addCoreTranslations();
  }

  static forRoot(access?: { accessProvider?: Provider; guardProvider?: Provider }): ModuleWithProviders<PryCoreModule> {
    const defaultAccessProvider = { provide: PRY_ACCESS_TOKEN, useClass: PryDefaultAccessService };
    const defaultGuardProvider = { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard };
    return {
      ngModule: PryCoreModule,
      providers: [access?.accessProvider ?? defaultAccessProvider, access?.guardProvider ?? defaultGuardProvider]
    };
  }
}
