import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryI18nModule, PryIconModule, PryOverlayModule } from '@provoly/dashboard';
import {
  PryCardComponent,
  PryCardHeaderComponent,
  PryCardIconDirective,
  PryCardMenuDirective,
  PryCardSubtitleDirective,
  PryCardTitleDirective
} from './card.component';

const PRY_CARD_COMPONENTS = [
  PryCardComponent,
  PryCardIconDirective,
  PryCardTitleDirective,
  PryCardSubtitleDirective,
  PryCardMenuDirective,
  PryCardHeaderComponent
];

@NgModule({
  imports: [CommonModule, PryIconModule, OverlayModule, PryOverlayModule, PryI18nModule],
  declarations: [...PRY_CARD_COMPONENTS],
  exports: [...PRY_CARD_COMPONENTS]
})
export class PryCardModule {}
