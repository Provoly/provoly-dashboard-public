import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootImport } from '@schematics/angular/utility';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import { getFileContent } from '../utils/file-contents.function';
import { PackageJson } from '../utils/package-json.interface';
import { ProjectSetupOptions } from './schema';

export default function projectSetup(options: ProjectSetupOptions): Rule {
  return async (tree, context) => {
    context.logger.info('Adding @provoly/dashboard to project');
    addDependencies(tree, options);
    context.logger.info('Plan node install');
    context.addTask(new NodePackageInstallTask());
    return addProvolyForRoot(options, context, tree);
  };
}

function addDependencies(tree: Tree, options: ProjectSetupOptions) {
  console.log('Adding provoly dependencies');

  const packageJson = JSON.parse(getFileContent(tree, '/package.json')) as PackageJson;

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

function widgetImports(options: ProjectSetupOptions, context: SchematicContext, external: any) {
  context.logger.info('...Building widgets imports');

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
  let imports: string[] = [];

  definitions.forEach((definition) => {
    if (options.widgets.includes(definition.name)) {
      imports.push(
        definition.type +
          ':' +
          `{ name: '${definition.type}', load: () => import('${definition.path}').then((module) => ${external(
            'widgetLoader',
            '@provoly/dashboard'
          )}(module, '${definition.moduleName}')) }`
      );
    }
  });

  return '{' + imports.join(',') + '}';
}

function provolyUrls(options: ProjectSetupOptions, context: SchematicContext) {
  context.logger.info('...Building url options');

  const urlOptions: Record<string, string> = {};
  (
    ['pryUrl', 'path', 'mapUrl', 'wsUrl', 'geoServerUrl'] as ('pryUrl' | 'path' | 'mapUrl' | 'wsUrl' | 'geoServerUrl')[]
  ).forEach((option) => {
    if (options[option]) {
      urlOptions[option] = options[option] ?? '';
    }
  });

  return JSON.stringify(urlOptions);
}

async function addProvolyForRoot(options: ProjectSetupOptions, context: SchematicContext, tree: Tree) {
  context.logger.info('Adding provoly module import');

  const pryImportModule = 'PryDashboardModule';

  try {
    const modulePath = 'src/app/app.module.ts';
    if (!tree.exists(modulePath)) {
      throw new SchematicsException(`Module file ${modulePath} doesn't exist.`);
    }
    const recorder = tree.beginUpdate(modulePath);
    tree.commitUpdate(recorder);

    // Add an import `MyLibModule` from `provoly/dashboard` to the root of the user's project.
    return addRootImport(
      options.projectName,
      ({ code, external }) => code`${external(pryImportModule, '@provoly/dashboard')}.forRoot(
      ${widgetImports(options, context, external)},
      ${provolyUrls(options, context)},
      {
        attribute: {
          name: 'attribute',
          load: () =>
            import('@provoly/dashboard/tooltips/attribute').then((module) =>
              ${external('tooltipLoader', '@provoly/dashboard')}(module, 'PryAttributeTooltipModule')
            )
        }
      },
      {
        text: {
          name: 'text',
          load: () =>
            import('@provoly/dashboard/filters/text').then((module) => ${external(
              'filterLoader',
              '@provoly/dashboard'
            )}(module, 'PryTextFilterModule'))
        },
        date: {
          name: 'date',
          load: () =>
            import('@provoly/dashboard/filters/date').then((module) => ${external(
              'filterLoader',
              '@provoly/dashboard'
            )}(module, 'PryDateFilterModule'))
        },
        list: {
          name: 'list',
          load: () =>
            import('@provoly/dashboard/filters/list').then((module) => ${external(
              'filterLoader',
              '@provoly/dashboard'
            )}(module, 'PryListFilterModule'))
        },
        number: {
          name: 'number',
          load: () =>
            import('@provoly/dashboard/filters/number').then((module) => ${external(
              'filterLoader',
              '@provoly/dashboard'
            )}(module, 'PryNumberFilterModule'))
        }
      },
      []
    )`
    );
  } catch (e) {
    context.logger.info('Project module not found: You have to manually add Provoly import');
    return;
  }
}
