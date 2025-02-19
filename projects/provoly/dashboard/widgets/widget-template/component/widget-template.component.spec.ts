import { WidgetTemplateComponent } from '@provoly/dashboard/widgets/widget-template';
import { ResultSet } from '@provoly/dashboard';

const rs = {
  items: {
    classe: [
      {
        id: '5',
        oClass: 'classe',
        attributes: {
          num: { value: 4, type: 'VALUE', visible: true },
          dec: { value: 0.12, type: 'VALUE', visible: true },
          string: { value: 'une valeur', type: 'VALUE', visible: true }
        }
      },
      {
        id: '6',
        oClass: 'classe',
        attributes: {
          num: { value: 10, type: 'VALUE', visible: true },
          dec: { value: 0.12, type: 'VALUE', visible: true },
          string: { value: 'recherche', type: 'VALUE', visible: true }
        }
      },
      {
        id: '7',
        oClass: 'classe',
        attributes: {
          num: { value: 20, type: 'VALUE', visible: true },
          dec: { value: 0.14, type: 'VALUE', visible: true },
          string: { value: 'recherche', type: 'VALUE', visible: true }
        }
      }
    ]
  },
  relations: []
} as ResultSet;

describe('WidgetTemplateComponent', () => {
  it('should allow empty', () => {
    const template = '';
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('');
  });

  it('should allow html fixed content', () => {
    const template = '<div>Content</div>';
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('<div>Content</div>');
  });

  it('should allow css fixed content', () => {
    const template =
      '.card {\n' +
      '    display: flex;\n' +
      '    flex-direction: column;\n' +
      '    padding: 3px 15px;\n' +
      '  }\n' +
      '\n' +
      '  .content {\n' +
      '    display: flex;\n' +
      '    flex-direction: column;\n' +
      '  }';
    expect(WidgetTemplateComponent.limitScope(WidgetTemplateComponent.evaluate(template, rs), 'my-id')).toEqual(
      '.pry-template-my-id .card {\n' +
        '    display: flex;\n' +
        '    flex-direction: column;\n' +
        '    padding: 3px 15px;\n' +
        '  }.pry-template-my-id \n' +
        '\n' +
        '  .content {\n' +
        '    display: flex;\n' +
        '    flex-direction: column;\n' +
        '  }'
    );
  });

  it('should allow replaceable content', () => {
    const template =
      '<div>ENGAGEMENT COLLABORATEURS: <span style="color: green">+{{rs[\'classe\'][0].attributes.string }}</span></div>';
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual(
      '<div>ENGAGEMENT COLLABORATEURS: <span style="color: green">+une valeur</span></div>'
    );
  });

  it('should allow basic arithmetic operations', () => {
    const template =
      "<div>ENGAGEMENT COLLABORATEURS: <span style=\"color: green\">{{rs['classe'][0].attributes.num + 2 }}|{{rs['classe'][0].attributes.dec * 100 }}|{{rs['classe'][0].attributes.num -2 }}|{{rs['classe'][0].attributes.dec / 10 }}</span></div>";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual(
      '<div>ENGAGEMENT COLLABORATEURS: <span style="color: green">6|12|2|0.012</span></div>'
    );
  });

  it('should allow basic comparisons', () => {
    const template = "<div class='visible-{{rs['classe'][0].attributes.num > 0 }}'>Visible if positive</div>";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual(
      "<div class='visible-true'>Visible if positive</div>"
    );
  });

  it('should allow search using id', () => {
    const template = "{{rs['classe'][id='7'].attributes.num }}";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('20');
  });

  it('should allow search using attributes', () => {
    const template = "{{rs['classe'][string='recherche'].attributes.num }}";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('10');
  });

  it('should allow search using 2 attributes', () => {
    const template = "{{rs['classe'][string='recherche'&dec=0.14].attributes.num }}";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('20');
  });

  it('should allow search using 3 attributes', () => {
    const template = "{{rs['classe'][string='recherche'&dec=0.14&num=20].attributes.num }}";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('20');
  });

  it('should manage failing search', () => {
    const template = "{{rs['classe'][string='recherche'&dec=0.14&num=300].attributes.num }}";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('undefined');
  });

  it('should allow search using 3 attributes, combined with arithmetic operations', () => {
    const template = "{{rs['classe'][string='recherche'&dec=0.14&num=20].attributes.num * 100 }}";
    expect(WidgetTemplateComponent.evaluate(template, rs)).toEqual('2000');
  });
});
