import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFileContent } from '../utils/file-contents.function';
import { PackageJson } from '../utils/package-json.interface';
import { ProjectSetupOptions } from './schema';

const schematicName = 'ng-add';
describe(schematicName, () => {
  const runner = new SchematicTestRunner('schematics', path.join(__dirname, '../collection.json'));
  let tree: UnitTestTree;
  let logFn = () => {};

  beforeAll(() => {
    // Deactivate logs
    logFn = console.log;
    console.log = () => {};
  });

  afterAll(() => {
    console.log = logFn;
  });

  beforeEach(async () => {
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'ng-new',
      { name: 'test-project', version: '0.0.0', directory: '.' },
      new UnitTestTree(Tree.empty())
    );
  });

  it('should add main dependencies', async () => {
    await runner.runSchematic(
      schematicName,
      { widgets: [], pipeline: false, projectName: 'test-project' } as ProjectSetupOptions,
      tree
    );

    const packageJson = JSON.parse(getFileContent(tree, '/package.json')) as PackageJson;

    expect(packageJson.dependencies['uuid']).toBe('^9.0.0');
    expect(packageJson.devDependencies['@types/uuid']).toBe('^9.0.0');
    expect(packageJson.dependencies['ol']).toBe(undefined);

    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
  });

  it('should add specific dependencies', async () => {
    await runner.runSchematic(
      schematicName,
      { widgets: ['widget-map'], pipeline: false, projectName: 'test-project' } as ProjectSetupOptions,
      tree
    );

    const packageJson = JSON.parse(getFileContent(tree, '/package.json')) as PackageJson;

    expect(packageJson.dependencies['uuid']).toBe('^9.0.0');
    expect(packageJson.devDependencies['@types/uuid']).toBe('^9.0.0');
    expect(packageJson.dependencies['ol']).toBe('^7.0.0');

    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
  });

  it(`should add autoLoad options to widget map`, async () => {
    await runner.runSchematic(
      schematicName,
      { widgets: ['widget-map'], pipeline: false, projectName: 'test-project' } as ProjectSetupOptions,
      tree
    );
    const actual = tree.readContent('/src/app/app.module.ts');
    expect(actual).toMatch(/autoLoadDatasource: 'not-geo',/);
  });

  it(`should add autoLoad options to widget aggregated chart`, async () => {
    await runner.runSchematic(
      schematicName,
      { widgets: ['widget-aggregated-chart'], pipeline: false, projectName: 'test-project' } as ProjectSetupOptions,
      tree
    );
    const actual = tree.readContent('/src/app/app.module.ts');
    expect(actual).toMatch(/autoLoadDatasource: 'none',/);
  });

  it(`should not add autoLoad options to widget table`, async () => {
    await runner.runSchematic(
      schematicName,
      { widgets: ['widget-table'], pipeline: false, projectName: 'test-project' } as ProjectSetupOptions,
      tree
    );
    const actual = tree.readContent('/src/app/app.module.ts');
    expect(actual).not.toMatch(/autoLoadDatasource: /);
  });
});
