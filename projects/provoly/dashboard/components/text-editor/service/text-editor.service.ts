import { Injectable } from '@angular/core';

export const mdStyles = {
  h1: '# ',
  h2: '## ',
  h3: '### ',
  h4: '#### ',
  h5: '##### ',
  h6: '###### ',
  bold: '**',
  italic: '*',
  underline: '<u>',
  strikeThrough: '~~',
  code: '`',
  blockquote: '> ',
  list: '- ',
  orderedList: '\\d+\\. ',
  table: '|  |  |\n| --- | --- |\n|  |  |',
  details: '<details>\n<summary></summary>\n'
};

export type MdStyle = keyof typeof mdStyles;

export const wrapperStyles: MdStyle[] = ['bold', 'italic', 'underline', 'strikeThrough', 'code'];
export const selfClosingStyles: MdStyle[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
export const listStyles: MdStyle[] = ['blockquote', 'list', 'orderedList'];
export const otherStyles: MdStyle[] = ['table', 'details'];

@Injectable({
  providedIn: 'root'
})
export class TextEditorService {
  constructor() {}

  getClosingTag(style: MdStyle) {
    switch (style) {
      case 'underline':
        return '</u>';
      case 'details':
        return '\n</details>';
      case 'bold':
      case 'italic':
      case 'strikeThrough':
      case 'code':
        return mdStyles[style];
      default:
        return '';
    }
  }

  addMarkdown(text: string, style: MdStyle) {
    if (wrapperStyles.includes(style)) {
      return this.toggleWrapperStyle(text, style);
    }
    if (selfClosingStyles.includes(style)) {
      return this.toggleSelfClosingStyle(text, style);
    }
    if (listStyles.includes(style)) {
      return this.toggleListStyle(text, style);
    }
    if (otherStyles.includes(style)) {
      return this.insertOtherStyle(text, style);
    }
    console.error(`Markdown style ${style} not supported`);
    return text;
  }

  toggleWrapperStyle(text: string, style: MdStyle) {
    if (text.startsWith(mdStyles[style])) {
      const startRegex = new RegExp(`^${this.escapeRegExp(mdStyles[style])}`);
      const endRegex = new RegExp(`${this.escapeRegExp(this.getClosingTag(style))}$`);
      return text.replace(startRegex, '').replace(endRegex, '');
    }
    return `${mdStyles[style]}${text}${this.getClosingTag(style)}`;
  }

  toggleSelfClosingStyle(text: string, style: MdStyle) {
    if (text.startsWith(mdStyles[style])) {
      const startRegex = new RegExp(`^${this.escapeRegExp(mdStyles[style])}`);
      return text.replace(startRegex, '');
    }
    return `${mdStyles[style]}${text}`;
  }

  toggleListStyle(text: string, style: MdStyle) {
    const listStyle = mdStyles[style];
    const lines = text.split('\n');
    const startRegex = new RegExp(`^${style === 'orderedList' ? listStyle : this.escapeRegExp(listStyle)}`);
    const isListAlready = lines.every((line) => startRegex.test(line));
    const newLines = lines.map((line, index) => {
      if (isListAlready) {
        return line.replace(startRegex, '');
      }
      return `${style === 'orderedList' ? (index + 1).toString() + '. ' : listStyle}${line}`;
    });
    return newLines.join('\n');
  }

  insertOtherStyle(text: string, style: MdStyle) {
    return `${mdStyles[style]}${text}${this.getClosingTag(style)}`;
  }

  escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  isListLine(line: string) {
    return /^(\d+\.|- |\* |\> )/.test(line);
  }

  isOrderedListLine(text: string) {
    return /^\d+\./.test(text);
  }

  getListCharacter(previousLine: string) {
    if (this.isOrderedListLine(previousLine)) {
      const match = previousLine.match(/^\d+/)?.[0];
      return (parseInt(match ?? '1') + 1).toString() + '. ';
    }
    if (/^- /.test(previousLine)) {
      return '- ';
    }
    if (/^\* /.test(previousLine)) {
      return '* ';
    }
    if (/^\> /.test(previousLine)) {
      return '> ';
    }
    return 'list';
  }

  updateOrderedListLines(text: string) {
    let order = 1;
    return text
      .split('\n')
      .map((line) => {
        if (/^\d+\./.test(line)) {
          return line.replace(/^\d+\. /, `${order++}. `);
        }
        order = 1;
        return line;
      })
      .join('\n');
  }
}
