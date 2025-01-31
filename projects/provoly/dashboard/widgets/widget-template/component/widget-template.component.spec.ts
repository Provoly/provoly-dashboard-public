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
});
