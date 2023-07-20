import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class ContextMenuEffects {
  constructor(private actions$: Actions) {}
}
