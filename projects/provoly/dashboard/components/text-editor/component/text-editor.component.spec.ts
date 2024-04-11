import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { PryTextEditorComponent } from './text-editor.component';
import { TextEditorService } from '../service/text-editor.service';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';

const testData = {
  text: 'example text',
  textToList: '1. example text',
  list: '1. list-element\n2. list-element\n3. text'
};

describe('PryTextEditorComponent', () => {
  let component: PryTextEditorComponent;
  let fixture: ComponentFixture<PryTextEditorComponent>;
  let service: TextEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [PryTextEditorComponent, MockI18nPipe, MockPryIconComponent],
      providers: [TextEditorService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryTextEditorComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TextEditorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUpdatedValue', () => {
    it('should replace the text selected in textarea with provided string', () => {
      const text = testData.text;
      const words = text.split(' ');
      component.writeValue(text);
      const spy = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        selectionStart: words[0].length + 1,
        selectionEnd: text.length
      });

      expect(component.getUpdatedValue('**text**')).toBe('example **text**');
    });

    it('should replace the selected text and all characters on the line with provided string', () => {
      const text = testData.list;
      const lines = text.split('\n');
      component.writeValue(text);

      const spy = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        // simulate the prompt of the text area being at the end of the list
        selectionStart: text.length,
        selectionEnd: text.length
      });

      expect(component.getUpdatedValue('text', text.length - lines[2].length)).toBe(
        '1. list-element\n2. list-element\ntext'
      );
    });
  });

  describe('formatText', () => {
    let text = '';
    let spyTextArea: any;

    beforeEach(() => {
      text = testData.text;
      component.writeValue(text);
      spyTextArea = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        // simulate the prompt of the text area being at the end of the input text
        selectionStart: text.length,
        selectionEnd: text.length
      });
    });

    it('should take into account the whole line if applied style is a list style', () => {
      component.formatText('orderedList');

      expect(component.value).toBe(testData.textToList);
      expect(component.value).not.toBe(text + '1. ');
    });

    it('should take into account only the selection if applied style is not a list style', () => {
      component.formatText('bold');

      expect(component.value).toBe(testData.text + '****');
      expect(component.value).not.toBe('****' + testData.text);
    });

    it('should call service to add md', () => {
      const serviceSpy = jest.spyOn(service, 'addMarkdown');

      component.formatText('orderedList');

      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should focus back the selection AND style  after style is applied', () => {
      const focusSpy = jest.spyOn(component, 'focusSelection');

      component.formatText('orderedList');

      expect(focusSpy).toHaveBeenCalledWith(0, '1. '.length + text.length);
    });
  });

  describe('getSelectionLineIndex', () => {
    let text = '';
    let spyTextArea: any;

    it('should return the index of the beginning of the current line that contains the selection', () => {
      text = testData.list;
      component.writeValue(text);
      spyTextArea = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        selectionStart: text.length
      });

      const lines = text.split('\n');
      expect(component.getSelectionLineIndex()).toBe(text.length - lines[lines.length - 1].length);
    });

    it('should return 0 if selection is on first line of text', () => {
      text = testData.text;
      component.writeValue(text);
      spyTextArea = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        selectionStart: text.length
      });

      expect(component.getSelectionLineIndex()).toBe(0);
    });
  });

  describe('insertStyleCharacter', () => {
    it('should insert appropriate list character ("- ", "* ", "1. ") after entering newLine', () => {
      const text = testData.list + '\n';
      component.writeValue(text);
      const spyTextArea = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        selectionStart: text.length,
        selectionEnd: text.length
      });

      jest.useFakeTimers();
      component.insertListStyleCharacter();
      jest.runAllTimers();
      expect(component.value).toBe(text + '4. ');
      jest.useRealTimers();
    });

    it('should not insert list character when entering newLine if previous line is not part of a list', () => {
      const text = testData.text + '\n';
      component.writeValue(text);

      const spyTextArea = jest.spyOn(component, 'textarea', 'get').mockReturnValue({
        ...component.textarea,
        selectionStart: text.length
      });
      jest.useFakeTimers();
      component.insertListStyleCharacter();
      jest.runAllTimers();
      expect(component.value).toBe(text);
    });
  });
});
