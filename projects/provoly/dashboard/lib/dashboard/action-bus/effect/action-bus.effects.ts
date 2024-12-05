import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { BusService } from '../service/bus.service';

@Injectable()
export class ActionBusEffects {
  forwardOnBus$ = createEffect(
    () =>
      this.actions$.pipe(
        // For actions with type containing "(bus)", automatically transfer it on the data-bus to propagate to other windows
        filter((action) => action.type.includes('(bus)')),
        tap((action) => this.busService.postData(action))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private busService: BusService
  ) {}
}
