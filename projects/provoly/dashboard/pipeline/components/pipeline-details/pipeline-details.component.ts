import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '@provoly/dashboard';
import { combineLatestWith, map, Observable, startWith } from 'rxjs';
import { v4 } from 'uuid';
import { PipelineActions } from '../../store/pipeline.actions';
import { PipelineSelectors } from '../../store/pipeline.selectors';
import { PryTransfo } from '../pipeline-editor/pipeline.interface';

@Component({
  selector: 'pry-pipeline-details',
  templateUrl: './pipeline-details.component.html'
})
export class PryPipelineDetailsComponent extends SubscriptionnerDirective implements OnInit {
  @Input() pipeline: PryTransfo = {
    id: v4(),
    links: [],
    nodes: [],
    title: '',
    description: '',
    creationDate: new Date().toDateString(),
    version: '',
    active: false,
    lastJobExecution: null
  };
  @Output() goToList = new EventEmitter();
  @Output() goToConsult = new EventEmitter();
  @Output() goToEditor = new EventEmitter<PryTransfo>();
  @Output() executeConfirm = new EventEmitter();
  pipeline$!: Observable<PryTransfo | undefined>;
  isSaved$!: Observable<boolean>;
  isSavingDisabled$!: Observable<boolean>;
  form!: FormGroup;

  constructor(private store: Store) {
    super();
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      description: new FormControl(null, [Validators.maxLength(200)])
    });
  }

  ngOnInit(): void {
    this.form.setValue({ title: this.pipeline.title, description: this.pipeline.description });
    this.pipeline$ = this.store.select(PipelineSelectors.transfo(this.pipeline.id));
    this.isSaved$ = this.pipeline$.pipe(map((pipeline) => !!pipeline));
    this.isSavingDisabled$ = this.pipeline$.pipe(
      combineLatestWith(
        this.form.valueChanges.pipe(
          startWith({ title: this.form.value.title, description: this.form.value.description })
        )
      ),
      map(([pipeline, form]) => {
        return !!pipeline && form.title === pipeline?.title && form.description === pipeline?.description;
      })
    );
    this.subscriptions.add(
      this.store.select(PipelineSelectors.activeError).subscribe((error) => {
        if (error && error.id === this.pipeline.id) {
          this.pipeline = {
            ...this.pipeline,
            active: false
          };
        }
      })
    );
  }

  save() {
    this.setFormDataInPipeline();
    this.store.dispatch(
      PipelineActions.check({
        graph: {
          id: this.pipeline.id,
          title: this.pipeline.title,
          description: this.pipeline.description,
          links: this.pipeline.links,
          nodes: this.pipeline.nodes
        },
        fetch: true
      })
    );
  }

  setFormDataInPipeline() {
    this.pipeline = {
      ...this.pipeline,
      title: this.form.value.title,
      description: this.form.value.description
    } as PryTransfo;
  }

  openEditor() {
    this.setFormDataInPipeline();
    this.goToEditor.emit(this.pipeline);
  }

  toggleActivation() {
    this.store.dispatch(PipelineActions.toggleActivation({ transfo: this.pipeline }));
    this.pipeline = {
      ...this.pipeline,
      active: !this.pipeline.active
    };
  }
}
