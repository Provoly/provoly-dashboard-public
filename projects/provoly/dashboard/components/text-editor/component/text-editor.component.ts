import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { listStyles, MdStyle, TextEditorService } from '../service/text-editor.service';
import { distinctUntilChanged, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pry-text-editor',
  templateUrl: 'text-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PryTextEditorComponent
    }
  ]
})
export class PryTextEditorComponent implements ControlValueAccessor {
  value = '';
  onChange = (value: string) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  valueChanged$ = new Subject<string>();

  @Input() tabView = true;
  tabs = ['write', 'preview'];
  activeTab = 'write';

  @ViewChild('textarea') textareaRef?: ElementRef<HTMLTextAreaElement>;
  buttons: { style: MdStyle; icon: string }[] = [
    { style: 'h3', icon: 'format_title' },
    { style: 'bold', icon: 'format_bold' },
    { style: 'italic', icon: 'format_italic' },
    { style: 'underline', icon: 'format_underlined' },
    { style: 'strikeThrough', icon: 'format_strikethrough' },
    { style: 'blockquote', icon: 'format_quote' },
    { style: 'list', icon: 'format_list_bulleted' },
    { style: 'orderedList', icon: 'format_list_numbered' },
    { style: 'table', icon: 'format_table' },
    { style: 'details', icon: 'format_details' }
  ];

  constructor(private service: TextEditorService) {
    this.valueChanged$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.onChange(value);
    });
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onValueChange($event: string) {
    this.valueChanged$.next($event);
  }

  get textarea(): HTMLTextAreaElement {
    return this.textareaRef!.nativeElement;
  }

  getActiveTabIndex(): number {
    return this.tabs.findIndex((t) => t === this.activeTab);
  }

  formatText(style: MdStyle) {
    const start = listStyles.includes(style) ? this.getSelectionLineIndex() : this.textarea.selectionStart,
      selection = this.value.substring(start, this.textarea.selectionEnd);

    this.writeValue(this.getUpdatedValue(this.service.addMarkdown(selection, style), start));
    this.onChange(this.value);

    this.focusSelection(start, start + this.service.addMarkdown(selection, style).length);
  }

  getUpdatedValue(value: string, lineStart?: number) {
    const len = this.value.length,
      start = lineStart ?? this.textarea.selectionStart;
    return this.value.substring(0, start) + value + this.value.substring(this.textarea.selectionEnd, len);
  }

  getSelectionLineIndex() {
    const previousNewlineIndex = this.value.substring(0, this.textarea.selectionStart).lastIndexOf('\n');
    return previousNewlineIndex ? previousNewlineIndex + 1 : 0;
  }

  focusSelection(start: number, end: number) {
    setTimeout(() => {
      this.textarea.focus();
      this.textarea.setSelectionRange(start, end);
    });
  }

  insertListStyleCharacter() {
    setTimeout(() => {
      const start = 0;
      const end = this.textarea.selectionStart;
      const text = this.value.substring(start, end);
      const previousLine = text?.split('\n')[text?.split('\n').length - 2];
      if (previousLine && this.service.isListLine(previousLine)) {
        const updatedValue = this.getUpdatedValue(this.service.getListCharacter(previousLine));
        this.writeValue(
          this.service.isOrderedListLine(previousLine)
            ? this.service.updateOrderedListLines(updatedValue)
            : updatedValue
        );
        this.onChange(this.value);
      }
    });
  }
}
