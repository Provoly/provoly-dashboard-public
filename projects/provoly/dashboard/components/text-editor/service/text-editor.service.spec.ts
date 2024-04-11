import { MdStyle, mdStyles, TextEditorService } from './text-editor.service';

describe('TextEditorService', () => {
  let service: TextEditorService;

  beforeEach(() => {
    service = new TextEditorService();
  });

  describe('getClosingTag', () => {
    it('should get correct closing tag for style', () => {
      expect(service.getClosingTag('bold')).toBe(mdStyles.bold);
      expect(service.getClosingTag('underline')).toBe('</u>');
      expect(service.getClosingTag('details')).toBe('\n</details>');
      expect(service.getClosingTag('table')).toBe('');
    });
  });

  describe('addMarkdown', () => {
    it('should call correct method per markdown style', () => {
      const [spyWrapper, spySelfClosing, spyList, spyOther] = [
        jest.spyOn(service, 'toggleWrapperStyle'),
        jest.spyOn(service, 'toggleSelfClosingStyle'),
        jest.spyOn(service, 'toggleListStyle'),
        jest.spyOn(service, 'insertOtherStyle')
      ];

      service.addMarkdown('test', 'italic');
      expect(spyWrapper).toHaveBeenCalled();

      service.addMarkdown('test', 'h1');
      expect(spySelfClosing).toHaveBeenCalled();

      service.addMarkdown('test', 'orderedList');
      expect(spyList).toHaveBeenCalledTimes(1);

      service.addMarkdown('test', 'table');
      expect(spyOther).toHaveBeenCalledTimes(1);
    });

    it('should log error and return initial text if incorrect style is called', () => {
      console.error = jest.fn();
      expect(service.addMarkdown('test', 'incorrect' as MdStyle)).toBe('test');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('style toggling/adding methods', () => {
    const testCases = [
      // { method, inputText, style, expectedOutput }

      // wrapper and self-closing styles
      {
        method: (text: string, style: MdStyle) => service.toggleWrapperStyle(text, style),
        inputText: 'test',
        style: 'bold',
        expectedOutput: `${mdStyles.bold}test${mdStyles.bold}`
      },
      {
        method: (text: string, style: MdStyle) => service.toggleWrapperStyle(text, style),
        inputText: `${mdStyles.bold}test${mdStyles.bold}`,
        style: 'bold',
        expectedOutput: 'test'
      },
      {
        method: (text: string, style: MdStyle) => service.toggleSelfClosingStyle(text, style),
        inputText: 'test',
        style: 'h3',
        expectedOutput: `${mdStyles.h3}test`
      },
      {
        method: (text: string, style: MdStyle) => service.toggleSelfClosingStyle(text, style),
        inputText: `${mdStyles.h3}test`,
        style: 'h3',
        expectedOutput: 'test'
      },

      // list styles
      {
        method: (text: string, style: MdStyle) => service.toggleListStyle(text, style),
        inputText: 'test\ntest\ntest',
        style: 'list',
        expectedOutput: `${mdStyles.list}test\n${mdStyles.list}test\n${mdStyles.list}test`
      },
      {
        method: (text: string, style: MdStyle) => service.toggleListStyle(text, style),
        inputText: `${mdStyles.list}test\n${mdStyles.list}test`,
        style: 'list',
        expectedOutput: 'test\ntest'
      },
      {
        method: (text: string, style: MdStyle) => service.toggleListStyle(text, style),
        inputText: 'test\ntest\ntest',
        style: 'orderedList',
        expectedOutput: `1. test\n2. test\n3. test`
      },
      {
        method: (text: string, style: MdStyle) => service.toggleListStyle(text, style),
        inputText: `1. test\n2. test\n3. test`,
        style: 'orderedList',
        expectedOutput: 'test\ntest\ntest'
      },

      // other styles (only insert styles, no toggling)
      {
        method: (text: string, style: MdStyle) => service.insertOtherStyle(text, style),
        inputText: 'test',
        style: 'table',
        expectedOutput: `${mdStyles.table}test`
      },
      {
        method: (text: string, style: MdStyle) => service.insertOtherStyle(text, style),
        inputText: 'test',
        style: 'details',
        expectedOutput: `${mdStyles.details}test\n</details>`
      }
    ];

    test.each(testCases)(
      'toggling style on "$inputText" should output "$expectedOutput"',
      ({ method, inputText, style, expectedOutput }) => {
        expect(method(inputText, style as MdStyle)).toBe(expectedOutput);
      }
    );
  });

  describe('escapeRegExp', () => {
    it('should escape special regex characters used in markdown', () => {
      expect(service.escapeRegExp('test')).toBe('test');
      expect(service.escapeRegExp('**')).toBe('\\*\\*');
      expect(service.escapeRegExp('## ')).toBe('\\#\\#\\ ');
    });
  });

  describe('list interaction methods', () => {
    describe('isListLine', () => {
      it('should asses if line of text belongs to a list', () => {
        expect(service.isListLine('1. test')).toBe(true);
        expect(service.isListLine('- test')).toBe(true);
        expect(service.isListLine('* test')).toBe(true);
        expect(service.isListLine('> test')).toBe(true);
        expect(service.isListLine('test')).toBe(false);
      });
    });

    describe('isOrderedListLine', () => {
      it('should asses if line of text belongs to an ordered list', () => {
        expect(service.isOrderedListLine('1. test')).toBe(true);
        expect(service.isOrderedListLine('222. test')).toBe(true);
        expect(service.isOrderedListLine('- test')).toBe(false);
      });
    });

    describe('getListCharacter', () => {
      it('should return the correct list character to append to the next line', () => {
        expect(service.getListCharacter('33. test')).toBe('34. ');
        expect(service.getListCharacter('* test')).toBe('* ');
        expect(service.getListCharacter('- test')).toBe('- ');
        expect(service.getListCharacter('> test')).toBe('> ');
      });
    });

    describe('updateOrderedListLines', () => {
      const elements = ['1. test', '\n', '2. test', '\n', '3. test', '\n'];

      it('should do nothing if all <li>s are in order', () => {
        expect(service.updateOrderedListLines(elements.join(''))).toBe(elements.join(''));
      });

      it('should update line numbers if new <li> is added in the middle of the list (and is out of order)', () => {
        const newElement = '3. test\n';
        const expectedElement = '4. test\n';
        expect(service.updateOrderedListLines([...elements, newElement].join(''))).toBe(
          [...elements, expectedElement].join('')
        );
      });

      it('should not break other lists if theres two lists in text', () => {
        const twoLists = ['1. l1', '\n', '2. l1', '\n', '3. l1', '\n', '\n', '1. l2', '\n', '2. l2', '\n', '3. l2'];

        const newElement = '3. test\n';
        const expectedElement = '4. test\n';
        expect(service.updateOrderedListLines([...twoLists.slice(0, 6), newElement, twoLists.slice(6)].join(''))).toBe(
          [...twoLists.slice(0, 6), expectedElement, twoLists.slice(6)].join('')
        );
      });
    });
  });
});
