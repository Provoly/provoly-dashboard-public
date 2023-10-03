import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PryCoreModule, PryI18nModule, PryIconModule, PrySelectModule } from '@provoly/dashboard';
import { PryMetadataEditorComponent } from './metadata-editor.component';
import { MetadataEffects } from './store/metadata.effects';
import { metadataFeatureKey, metadataReducer } from './store/metadata.reducer';
import { PryMetadataEditorCssComponent } from './style/css.component';

const PRY_METADATA_EDITOR_COMPONENTS = [PryMetadataEditorComponent, PryMetadataEditorCssComponent];

@NgModule({
  declarations: [...PRY_METADATA_EDITOR_COMPONENTS],
  exports: [...PRY_METADATA_EDITOR_COMPONENTS],
  imports: [
    CommonModule,
    StoreModule.forFeature(metadataFeatureKey, metadataReducer),
    EffectsModule.forFeature([MetadataEffects]),
    PryCoreModule,
    PryI18nModule,
    ReactiveFormsModule,
    PrySelectModule,
    PryIconModule
  ]
})
export class PryExpandPanelModule {}
