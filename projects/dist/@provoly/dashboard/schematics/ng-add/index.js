import { __awaiter } from "tslib";
import { virtualFs, workspaces } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addModuleImportToRootModule, getProjectFromWorkspace } from '@angular/cdk/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { getFileContent } from '../utils/file-contents.function';
export default function projectSetup(options) {
    return (tree, context) => __awaiter(this, void 0, void 0, function* () {
        context.logger.info('Adding @provoly/dashboard to project');
        addDependencies(tree, options);
        yield addProvolyForroot(tree, options);
        context.logger.info('Plan node install');
        context.addTask(new NodePackageInstallTask());
    });
}
function addDependencies(tree, options) {
    console.log('Adding provoly dependencies');
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
    const dependencies = [
        { type: NodeDependencyType.Default, version: packageJson.version, name: '@provoly/dashboard' },
        { type: NodeDependencyType.Default, version: '^9.0.0', name: 'uuid' },
        { type: NodeDependencyType.Default, version: '^3.1.3', name: 'fast-deep-equal' },
        { type: NodeDependencyType.Default, version: '^1.2.3', name: 'css-element-queries' },
        { type: NodeDependencyType.Default, version: '^6.0.0', name: 'buffer' },
        { type: NodeDependencyType.Dev, version: '^9.0.0', name: '@types/uuid' }
    ];
    if (options.widgets.includes('widget-map')) {
        dependencies.push({ type: NodeDependencyType.Default, version: '^7.0.0', name: 'ol' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^4.1.0', name: 'ol-layerswitcher' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^10.6.0', name: 'ol-mapbox-style' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^10.6.0', name: 'ol-mapbox-style' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^2.9.0', name: 'proj4' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^4.0.2', name: 'shpjs' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^0.0.1', name: 'geojson-to-kml' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^3.7.1', name: 'jszip' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^6.5.3', name: '@types/ol' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^2.5.2', name: '@types/proj4' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^3.4.1', name: '@types/shpjs' });
    }
    if (options.widgets.includes('widget-aggregated-chart')) {
        dependencies.push({ type: NodeDependencyType.Default, version: '^5.21.0', name: 'vega' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^6.20.5', name: 'vega-embed' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^5.2.0', name: 'vega-lite' });
    }
    if (options.widgets.includes('widget-graph')) {
        dependencies.push({ type: NodeDependencyType.Default, version: '^3.0.0', name: 'd3-drag' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^3.0.0', name: 'd3-force' });
        dependencies.push({ type: NodeDependencyType.Default, version: '^3.0.0', name: 'd3-selection' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^3.0.1', name: '@types/d3-dispatch' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^3.0.1', name: '@types/d3-drag' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^3.0.3', name: '@types/d3-force' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^3.0.0', name: '@types/d3-timer' });
        dependencies.push({ type: NodeDependencyType.Dev, version: '^0.7.47', name: '@types/dagre' });
    }
    if (options.pipeline) {
        dependencies.push({ type: NodeDependencyType.Default, version: '^0.7.10', name: 'litegraph.js' });
    }
    dependencies.forEach((d) => {
        addPackageJsonDependency(tree, d);
    });
}
function createHost(tree) {
    return {
        readFile(path) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = tree.read(path);
                if (!data) {
                    throw new SchematicsException('File not found.');
                }
                return virtualFs.fileBufferToString(data);
            });
        },
        writeFile(path, data) {
            return __awaiter(this, void 0, void 0, function* () {
                return tree.overwrite(path, data);
            });
        },
        isDirectory(path) {
            return __awaiter(this, void 0, void 0, function* () {
                return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
            });
        },
        isFile(path) {
            return __awaiter(this, void 0, void 0, function* () {
                return tree.exists(path);
            });
        }
    };
}
function widgetImports(options) {
    const definitions = [
        {
            name: 'widget-aggregated-chart',
            path: '@provoly/dashboard/widgets/widget-aggregated-chart',
            moduleName: 'WidgetAggregatedChartModule',
            type: 'chart'
        },
        {
            name: 'widget-detail',
            path: '@provoly/dashboard/widgets/widget-detail',
            moduleName: 'WidgetDetailModule',
            type: 'detail'
        },
        {
            name: 'widget-graph',
            path: '@provoly/dashboard/widgets/widget-graph',
            moduleName: 'WidgetGraphModule',
            type: 'graph'
        },
        {
            name: 'widget-iframe',
            path: '@provoly/dashboard/widgets/widget-iframe',
            moduleName: 'WidgetIframeModule',
            type: 'iframe'
        },
        {
            name: 'widget-image',
            path: '@provoly/dashboard/widgets/widget-image',
            moduleName: 'WidgetImageModule',
            type: 'image'
        },
        { name: 'widget-map', path: '@provoly/dashboard/widgets/widget-map', moduleName: 'WidgetMapModule', type: 'map' },
        {
            name: 'widget-table',
            path: '@provoly/dashboard/widgets/widget-table',
            moduleName: 'WidgetTableModule',
            type: 'table'
        },
        {
            name: 'widget-template',
            path: '@provoly/dashboard/widgets/widget-template',
            moduleName: 'WidgetTemplateModule',
            type: 'template'
        },
        {
            name: 'widget-tile',
            path: '@provoly/dashboard/widgets/widget-tile',
            moduleName: 'WidgetTileModule',
            type: 'tile'
        }
    ];
    const imports = {};
    definitions.forEach((definition) => {
        if (options.widgets.includes(definition.name)) {
            imports[definition.type] = `{
          name: ${definition.type},
          load: () =>
            import(${definition.path}).then((module) => widgetLoader(module, ${definition.moduleName}))
      }`;
        }
    });
    return JSON.stringify(imports);
}
function provolyUrls(options) {
    const urlOptions = {};
    ['pryUrl', 'path', 'mapUrl', 'wsServerUrl', 'geoServerUrl'].forEach((option) => {
        var _a;
        if (options[option]) {
            urlOptions[option] = (_a = options[option]) !== null && _a !== void 0 ? _a : '';
        }
    });
    return JSON.stringify(urlOptions);
}
function addProvolyForroot(tree, options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Adding provoly module import');
        const pryImport = `PryDashboardModule.forRoot(
      ${widgetImports(options)},
      ${provolyUrls(options)},
      {
        attribute: {
          name: 'attribute',
          load: () =>
            import('@provoly/dashboard/tooltips/attribute').then((module) =>
              tooltipLoader(module, 'PryAttributeTooltipModule')
            )
        }
      },
      {
        text: {
          name: 'text',
          load: () =>
            import('@provoly/dashboard/filters/text').then((module) => filterLoader(module, 'PryTextFilterModule'))
        },
        date: {
          name: 'date',
          load: () =>
            import('@provoly/dashboard/filters/date').then((module) => filterLoader(module, 'PryDateFilterModule'))
        },
        list: {
          name: 'list',
          load: () =>
            import('@provoly/dashboard/filters/list').then((module) => filterLoader(module, 'PryListFilterModule'))
        },
        number: {
          name: 'number',
          load: () =>
            import('@provoly/dashboard/filters/number').then((module) => filterLoader(module, 'PryNumberFilterModule'))
        }
      },
      []
    )`;
        const { workspace } = yield workspaces.readWorkspace('/', createHost(tree));
        const project = getProjectFromWorkspace(workspace, options.project);
        addModuleImportToRootModule(tree, pryImport, '@provoly/dashboard', project);
    });
}
//# sourceMappingURL=index.js.map