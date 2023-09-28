import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import path from 'path';

const schematicName = 'ng-update';
describe(schematicName, () => {
  const runner = new SchematicTestRunner('schematics', path.join(__dirname, '../../migration.json'));
  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'ng-new',
      { name: 'test-project', version: '0.0.0', directory: '.' },
      new UnitTestTree(Tree.empty())
    );
  });

  it(`should replace 'legendUrl' with 'legendUrl | async'`, async () => {
    tree.create('/example.component.html', `<ng-container *ngIf="geoLayer | legendUrl"></ng-container>`);

    await runner.runSchematic('migration-v0.14', {}, tree);
    const actual = tree.readContent('/example.component.html');
    expect(actual).toMatch(/\|\s*legendUrl\s*\|\s*async"/);
    expect(actual).not.toMatch(/\|\s*legendUrl"/);
  });

  it(`should replace SelectionInteraction with InteractionManager`, async () => {
    tree.create(
      '/example.component.ts',
      `
      export class ExampleComponent {
        selectionInteraction = new SelectionInteraction();
        constructor() {
          this.selectionInteraction.methodCall()
        }
      }
    `
    );

    console.log(tree.readContent('/example.component.ts'));
    await runner.runSchematic('migration-v0.14', {}, tree);
    const actual = tree.readContent('/example.component.ts');

    expect(actual).not.toMatch(/SelectionInteraction/);
    expect(actual).not.toMatch(/this.selectionInteraction./);
    expect(actual).not.toMatch(/\sselectionInteraction/);

    expect(actual).toMatch(/InteractionManager/);
    expect(actual).toMatch(/interactionManager.selectionInteraction./);
    expect(actual).toMatch(/interactionManager/);
  });
});
