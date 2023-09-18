import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { removePackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { onMigrationComplete } from '../utils/complete.function';

function removeWidgetMapHoverOption() {
  return function (tree: Tree, context: SchematicContext) {
    tree.visit((path, entry) => {
      if (path.includes('.ts') || path.includes('.json')) {
        const buffer = tree.read(path);
        if (buffer) {
          tree.overwrite(
            path,
            buffer
              .toString()
              .replace(/tooltipMode(\s)*:(\s)*'hover'/g, "tooltipMode$1:$2'click'")
              .replace(/tooltipMode(\s)*:(\s)*TooltipMode.HOVER/g, 'tooltipMode$1:$2TooltipMode.CLICK')
          );
        }
      }
    });
    return undefined;
  };
}

function changeTypeDatasetMetadataToMetadataValue() {
  return function (tree: Tree, context: SchematicContext) {
    tree.visit((path, entry) => {
      if (path.includes('.ts')) {
        const buffer = tree.read(path);
        if (buffer) {
          tree.overwrite(path, buffer.toString().replace(/DatasetMetadata/g, 'MetadataValue'));
        }
      }
    });
    return undefined;
  };
}

function removeUselessDeps(tree: Tree) {
  removePackageJsonDependency(tree, 'ol-layerswitcher');
  removePackageJsonDependency(tree, 'geojson-to-kml');
  removePackageJsonDependency(tree, 'jszip');
  removePackageJsonDependency(tree, 'shpjs');
}

export function updateTo0_13(): Rule {
  return (_tree: Tree, context: SchematicContext): Rule => {
    removeUselessDeps(_tree);
    context.addTask(new NodePackageInstallTask());
    return chain([
      removeWidgetMapHoverOption(),
      changeTypeDatasetMetadataToMetadataValue(),
      onMigrationComplete('0.13', context)
    ]);
  };
}
