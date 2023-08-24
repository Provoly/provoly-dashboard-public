"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = tslib_1.__importStar(require("path"));
const file_contents_function_1 = require("../utils/file-contents.function");
const schematicName = 'ng-add';
describe(schematicName, () => {
    const runner = new testing_1.SchematicTestRunner('schematics', path.join(__dirname, '../collection.json'));
    let tree;
    beforeEach(async () => {
        tree = await runner.runExternalSchematic('@schematics/angular', 'ng-new', { name: 'test-project', version: '0.0.0', directory: '.' }, new testing_1.UnitTestTree(schematics_1.Tree.empty()));
    });
    it('should add main dependencies', async () => {
        await runner.runSchematic(schematicName, { widgets: [], pipeline: false, project: 'test-project' }, tree);
        const packageJson = JSON.parse((0, file_contents_function_1.getFileContent)(tree, '/package.json'));
        expect(packageJson.dependencies['@provoly/dashboard']).toBe(packageJson.version);
        expect(packageJson.dependencies['uuid']).toBe('^9.0.0');
        expect(packageJson.devDependencies['@types/uuid']).toBe('^9.0.0');
        expect(packageJson.dependencies['ol']).toBe(undefined);
        expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    });
    it('should add specific dependencies', async () => {
        await runner.runSchematic(schematicName, { widgets: ['widget-map'], pipeline: false, project: 'test-project' }, tree);
        const packageJson = JSON.parse((0, file_contents_function_1.getFileContent)(tree, '/package.json'));
        expect(packageJson.dependencies['@provoly/dashboard']).toBe(packageJson.version);
        expect(packageJson.dependencies['uuid']).toBe('^9.0.0');
        expect(packageJson.devDependencies['@types/uuid']).toBe('^9.0.0');
        expect(packageJson.dependencies['ol']).toBe('^7.0.0');
        expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    });
});
//# sourceMappingURL=index.spec.js.map