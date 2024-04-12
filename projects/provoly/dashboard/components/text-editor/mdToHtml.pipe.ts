import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'mdToHtml'
})
export class MdToHtmlPipe implements PipeTransform {
  transform(value?: string): string | Promise<string> {
    return marked.parse(value ?? '');
  }
}
