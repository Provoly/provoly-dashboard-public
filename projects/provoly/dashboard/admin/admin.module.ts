import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  PryCoreModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryModalModule,
  PryOverlayModule,
  PrySelectModule,
  PrySortModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PryExpandPanelModule } from '@provoly/dashboard/components/metadata-editor';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAbacRulesEditComponent } from './components/admin-abac-rules/admin-abac-rules-edit/admin-abac-rules-edit.component';
import { AdminAbacRulesFormComponent } from './components/admin-abac-rules/admin-abac-rules-form/admin-abac-rules-form.component';
import { AdminAbacRulesNewComponent } from './components/admin-abac-rules/admin-abac-rules-new/admin-abac-rules-new.component';
import { AdminAbacRulesViewComponent } from './components/admin-abac-rules/admin-abac-rules-view/admin-abac-rules-view.component';
import { AdminAbacRulesComponent } from './components/admin-abac-rules/admin-abac-rules.component';
import { AttributeConditionComponent } from './components/admin-abac-rules/components/attribute-condition/attribute-condition.component';
import { ComposedConditionComponent } from './components/admin-abac-rules/components/composed-condition/composed-condition.component';
import { MetadataConditionComponent } from './components/admin-abac-rules/components/metadata-condition/metadata-condition.component';
import { SelectAttributeComponent } from './components/admin-abac-rules/components/select-attribute/select-attribute.component';
import { SelectMetadataComponent } from './components/admin-abac-rules/components/select-metadata/select-metadata.component';
import { AbacRulesEffects } from './components/admin-abac-rules/store/abac-rules.effects';
import { abacRuleReducer, abacRulesFeatureKey } from './components/admin-abac-rules/store/abac-rules.reducer';
import { AdminClassesCustomizeComponent } from './components/admin-classes/admin-classes-customize/admin-classes-customize.component';
import { AdminClassesCustomizeSymbolComponent } from './components/admin-classes/admin-classes-customize/symbol/admin-classes-customize-symbol.component';
import { AdminClassesCustomizeTooltipComponent } from './components/admin-classes/admin-classes-customize/tooltip/admin-classes-customize-tooltip.component';
import { AdminClassesEditComponent } from './components/admin-classes/admin-classes-edit/admin-classes-edit.component';
import { AdminClassesFormComponent } from './components/admin-classes/admin-classes-form/admin-classes-form.component';
import { AdminClassesNewComponent } from './components/admin-classes/admin-classes-new/admin-classes-new.component';
import { AdminClassesSelectComponent } from './components/admin-classes/admin-classes-select/admin-classes-select.component';
import { AdminAttributesEditComponent } from './components/admin-classes/admin-classes-view/admin-attributes-edit/admin-attributes-edit.component';
import { AdminAttributesFormComponent } from './components/admin-classes/admin-classes-view/admin-attributes-form/admin-attributes-form.component';
import { AdminAttributesNewComponent } from './components/admin-classes/admin-classes-view/admin-attributes-new/admin-attributes-new.component';
import { AdminAttributesSelectComponent } from './components/admin-classes/admin-classes-view/admin-attributes-select/admin-attributes-select.component';
import { AdminClassesViewComponent } from './components/admin-classes/admin-classes-view/admin-classes-view.component';
import { AdminClassesComponent } from './components/admin-classes/admin-classes.component';
import { AdminClassEffects } from './components/admin-classes/store/admin-class.effects';
import { classesFeatureKey, classReducer } from './components/admin-classes/store/admin-class.reducer';
import { AdminDatasetComponent } from './components/admin-dataset/admin-dataset.component';
import { AdminEditDatasetComponent } from './components/admin-dataset/admin-edit-dataset/admin-edit-dataset.component';
import { AdminNewDatasetComponent } from './components/admin-dataset/admin-new-dataset/admin-new-dataset.component';
import { AdminSelectDatasetComponent } from './components/admin-dataset/admin-select-dataset/admin-select-dataset.component';
import { AdminFormDatasetComponent } from './components/admin-dataset/shared/admin-form-dataset/admin-form-dataset.component';
import { AdminEnvironmentFormComponent } from './components/admin-environment/admin-environment-form/admin-environment-form.component';
import { AdminEnvironmentNewComponent } from './components/admin-environment/admin-environment-new/admin-environment-new.component';
import { AdminEnvironmentSelectComponent } from './components/admin-environment/admin-environment-select/admin-environment-select.component';
import { AdminEnvironmentUpdateComponent } from './components/admin-environment/admin-environment-update/admin-environment-update.component';
import { AdminEnvironmentComponent } from './components/admin-environment/admin-environment.component';
import { EnvironmentEffects } from './components/admin-environment/store/environment.effects';
import { environmentFeatureKey, environmentReducer } from './components/admin-environment/store/environment.reducer';
import { AdminFieldsEditComponent } from './components/admin-fields/admin-fields-edit/admin-fields-edit.component';
import { AdminFieldsFormComponent } from './components/admin-fields/admin-fields-form/admin-fields-form.component';
import { AdminFieldsNewComponent } from './components/admin-fields/admin-fields-new/admin-fields-new.component';
import { AdminFieldsSelectComponent } from './components/admin-fields/admin-fields-select/admin-fields-select.component';
import { AdminFieldsComponent } from './components/admin-fields/admin-fields.component';
import { FieldsEffects } from './components/admin-fields/store/fields.effects';
import { fieldReducer, fieldsFeatureKey } from './components/admin-fields/store/fields.reducer';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminLinksNewComponent } from './components/admin-links/admin-links-new/admin-links-new.component';
import { AdminLinksComponent } from './components/admin-links/admin-links.component';
import { LinksEffects } from './components/admin-links/store/links.effects';
import { linkReducer, linksFeatureKey } from './components/admin-links/store/links.reducer';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminEditMetadataRulesComponent } from './components/admin-metadata-rules/admin-edit-metadata-rules/admin-edit-metadata-rules.component';
import { AdminMetadataRulesComponent } from './components/admin-metadata-rules/admin-metadata-rules.component';
import { AdminNewMetadataRulesComponent } from './components/admin-metadata-rules/admin-new-metadata-rules/admin-new-metadata-rules.component';
import { AdminSelectMetadataRulesComponent } from './components/admin-metadata-rules/admin-select-metadata-rules/admin-select-metadata-rules.component';
import { AdminFormMetadataRulesComponent } from './components/admin-metadata-rules/shared/admin-form-metadata-rules/admin-form-metadata-rules.component';
import { AdminMetadataRulesEffects } from './components/admin-metadata-rules/store/metadata-rules.effects';
import {
  adminMetadataRulesFeatureKey,
  adminMetadataRulesReducer
} from './components/admin-metadata-rules/store/metadata-rules.reducer';
import { AdminMetadataUserComponent } from './components/admin-metadata-user/admin-metadata-user.component';
import { AdminUserEditMetadataComponent } from './components/admin-metadata-user/admin-user-edit-metadata/admin-user-edit-metadata.component';
import { AdminUserNewMetadataComponent } from './components/admin-metadata-user/admin-user-new-metadata/admin-user-new-metadata.component';
import { AdminUserSelectMetadataComponent } from './components/admin-metadata-user/admin-user-select-metadata/admin-user-select-metadata.component';
import { AdminMetadataUserEffects } from './components/admin-metadata-user/store/admin-metadata-user.effects';
import {
  adminMetadataUserFeatureKey,
  adminMetadataUserReducer
} from './components/admin-metadata-user/store/admin-metadata-user.reducer';
import { AdminEditMetadataComponent } from './components/admin-metadata/admin-edit-metadata/admin-edit-metadata.component';
import { AdminMetadataComponent } from './components/admin-metadata/admin-metadata.component';
import { AdminNewMetadataComponent } from './components/admin-metadata/admin-new-metadata/admin-new-metadata.component';
import { AdminSelectMetadataComponent } from './components/admin-metadata/admin-select-metadata/admin-select-metadata.component';
import { FormMetadataComponent } from './components/admin-metadata/shared/form-metadata/form-metadata.component';
import { PryListMetadataModule } from './components/admin-metadata/shared/list-metadata/list-metadata.module';
import { AdminPredicatesFormComponent } from './components/admin-predicates/admin-predicates-form/admin-predicates-form.component';
import { AdminPredicatesNewComponent } from './components/admin-predicates/admin-predicates-new/admin-predicates-new.component';
import { AdminPredicatesSelectComponent } from './components/admin-predicates/admin-predicates-select/admin-predicates-select.component';
import { AdminPredicatesUpdateComponent } from './components/admin-predicates/admin-predicates-update/admin-predicates-update.component';
import { AdminPredicatesComponent } from './components/admin-predicates/admin-predicates.component';
import { PredicatesEffects } from './components/admin-predicates/store/predicates.effects';
import { predicateReducer, predicatesFeatureKey } from './components/admin-predicates/store/predicates.reducer';
import { AdminRelationTypesModalComponent } from './components/admin-relation-types/admin-relation-types-modal/admin-relation-types-modal.component';
import { AdminRelationTypesSelectComponent } from './components/admin-relation-types/admin-relation-types-select/admin-relation-types-select.component';
import { AdminRelationTypesComponent } from './components/admin-relation-types/admin-relation-types.component';
import { AdminTitleComponent } from './components/admin-title/admin-title.component';
import { AdminUserSelectComponent } from './components/admin-user/admin-user-select/admin-user-select.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { AdminUserEffects } from './components/admin-user/store/admin-user.effects';
import { adminUserFeatureKey, adminUserReducer } from './components/admin-user/store/admin-user.reducer';
import { PryAdminComponent } from './components/admin.component';
import { PryAssociationComponent } from './components/association/association.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { AdminEffects } from './store/admin.effects';
import { adminFeatureKey, adminReducer } from './store/admin.reducer';
import { PrySinceDateModule } from '@provoly/dashboard/components/sinceDate';
import { PryDatasetModule } from '@provoly/dashboard/dataset';

@NgModule({
  providers: [DatePipe],
  declarations: [
    PryAdminComponent,
    AdminEnvironmentComponent,
    AdminMetadataUserComponent,
    AdminClassesComponent,
    AdminPredicatesComponent,
    AdminPredicatesNewComponent,
    AdminPredicatesUpdateComponent,
    AdminPredicatesSelectComponent,
    AdminAbacRulesComponent,
    AdminMenuComponent,
    AdminLayoutComponent,
    AdminTitleComponent,
    AdminLayoutComponent,
    AdminMenuComponent,
    AdminMetadataComponent,
    AdminEnvironmentNewComponent,
    AdminEnvironmentUpdateComponent,
    AdminEnvironmentFormComponent,
    AdminNewMetadataComponent,
    AdminAbacRulesEditComponent,
    AdminAbacRulesViewComponent,
    AdminAbacRulesNewComponent,
    SelectMetadataComponent,
    SelectAttributeComponent,
    AttributeConditionComponent,
    MetadataConditionComponent,
    ComposedConditionComponent,
    AdminAbacRulesFormComponent,
    AdminUserNewMetadataComponent,
    AdminEditMetadataComponent,
    AdminPredicatesFormComponent,
    AdminEnvironmentSelectComponent,
    AdminUserEditMetadataComponent,
    AdminPredicatesFormComponent,
    FormMetadataComponent,
    AdminSelectMetadataComponent,
    AdminUserSelectMetadataComponent,
    AdminFieldsComponent,
    AdminFieldsNewComponent,
    AdminUserSelectMetadataComponent,
    AdminClassesFormComponent,
    AdminClassesNewComponent,
    AdminClassesViewComponent,
    AdminAttributesNewComponent,
    AdminAttributesFormComponent,
    AdminAttributesSelectComponent,
    AdminClassesSelectComponent,
    AdminFieldsFormComponent,
    AdminFieldsSelectComponent,
    AdminClassesEditComponent,
    AdminAttributesEditComponent,
    AdminFieldsEditComponent,
    AdminUserComponent,
    AdminUserSelectComponent,
    AdminRelationTypesComponent,
    AdminRelationTypesSelectComponent,
    AdminRelationTypesModalComponent,
    AdminLinksComponent,
    AdminLinksNewComponent,
    AdminMetadataRulesComponent,
    AdminSelectMetadataRulesComponent,
    AdminNewMetadataRulesComponent,
    AdminEditMetadataRulesComponent,
    AdminFormMetadataRulesComponent,
    AdminDatasetComponent,
    AdminEditDatasetComponent,
    AdminNewDatasetComponent,
    AdminSelectDatasetComponent,
    AdminFormDatasetComponent,
    AdminClassesCustomizeComponent,
    AdminClassesCustomizeTooltipComponent,
    AdminClassesCustomizeSymbolComponent,
    PryAssociationComponent
  ],
    imports: [
        CommonModule,
        PryCoreModule,
        AdminRoutingModule,
        StoreModule.forFeature(adminFeatureKey, adminReducer),
        StoreModule.forFeature(predicatesFeatureKey, predicateReducer),
        StoreModule.forFeature(abacRulesFeatureKey, abacRuleReducer),
        StoreModule.forFeature(environmentFeatureKey, environmentReducer),
        StoreModule.forFeature(adminMetadataUserFeatureKey, adminMetadataUserReducer),
        StoreModule.forFeature(adminMetadataRulesFeatureKey, adminMetadataRulesReducer),
        StoreModule.forFeature(classesFeatureKey, classReducer),
        StoreModule.forFeature(fieldsFeatureKey, fieldReducer),
        StoreModule.forFeature(adminUserFeatureKey, adminUserReducer),
        StoreModule.forFeature(linksFeatureKey, linkReducer),
        EffectsModule.forFeature([AdminEffects]),
        EffectsModule.forFeature([PredicatesEffects]),
        EffectsModule.forFeature([EnvironmentEffects]),
        EffectsModule.forFeature([AbacRulesEffects]),
        EffectsModule.forFeature([AdminMetadataUserEffects]),
        EffectsModule.forFeature([AdminClassEffects]),
        EffectsModule.forFeature([FieldsEffects]),
        EffectsModule.forFeature([AdminUserEffects]),
        EffectsModule.forFeature([LinksEffects]),
        EffectsModule.forFeature([AdminMetadataRulesEffects]),
        PryIconModule,
        FormsModule,
        ReactiveFormsModule,
        PrySortModule,
        PryCheckboxModule,
        PryModalModule,
        PrySelectModule,
        PryListMetadataModule,
        PryToggleModule,
        OverlayModule,
        PryOverlayModule,
        DragDropModule,
        PryI18nModule,
        PryExpandPanelModule,
        PrySinceDateModule,
        PryDatasetModule
    ]
})
export class PryAdminModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'admin', frTranslations);
    this.pryTranslateService.addLangObject('en', 'admin', enTranslations);
  }
}
