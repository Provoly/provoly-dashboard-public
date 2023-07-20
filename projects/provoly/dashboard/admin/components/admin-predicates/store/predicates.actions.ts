import { createAction, props } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';

export const PredicatesActions = {
  loadPredicates: createAction('[Admin/Predicates] Load Predicates'),
  loadPredicatesSuccess: createAction(
    '[Admin/Predicates Api] Load Predicates Success',
    props<{ datas: Predicate[] }>()
  ),
  loadPredicatesFailure: createAction('[Admin/Predicates Api] Load Predicates Failure', props<{ error: any }>()),

  savePredicate: createAction('[Admin/Predicates] Save Predicate', props<{ predicate: Predicate; route: string }>()),
  savePredicateSuccess: createAction('[Admin/Predicates Api] Save Predicate Success', props<{ route: string }>()),
  savePredicateFailure: createAction('[Admin/Predicates Api] Save Predicate Failure', props<{ error: any }>()),

  selectPredicate: createAction('[Admin/Predicates] Select Predicate', props<{ id: string }>()),
  selectPredicateSuccess: createAction('[Admin/Predicates Api] Select Predicate Success', props<{ data: Predicate }>()),
  selectPredicateFailure: createAction('[Admin/Predicates Api] Select Predicate Failure', props<{ error: any }>())
};
