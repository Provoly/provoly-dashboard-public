import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let uniqueId = 0;

@Component({
  selector: 'pry-edit-input',
  templateUrl: './edit-input.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryEditInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryEditInputComponent implements ControlValueAccessor {
  public id: number = uniqueId++;
  _disabled: boolean = false;
  value: any;
  _onChange = (_: any) => {};
  _onTouched = () => {};
  editMode = false;
  showButton = false;
  @Input() label: string = '';
  @Input() editButtonTooltip: string = '@pry.theme.editInput.toggle';
  @Input() confirmButtonTooltip: string = '@pry.theme.editInput.confirm';
  @Output() validated = new EventEmitter<string>();
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  constructor(private _cd: ChangeDetectorRef) {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (this.value !== obj) {
      this.value = obj;
      this._onChange(this.value);
      this._onTouched();
      this._cd.markForCheck();
    }
  }

  toggle(force?: boolean) {
    this.editMode = force !== undefined ? force : !this.editMode;
    if (this.editMode === false) {
      this.validated.emit(this.value);
    } else {
      setTimeout(() => {
        this.input?.nativeElement.focus();

      });
    }
  }
}
