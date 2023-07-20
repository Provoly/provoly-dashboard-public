import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryIconModule } from '../icon/icon.module';
import { PrySnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  declarations: [PrySnackbarComponent],
  imports: [CommonModule, PryIconModule],
  exports: [PrySnackbarComponent]
})
export class PrySnackbarModule {}
