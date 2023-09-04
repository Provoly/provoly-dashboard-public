import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
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

export function updateTo0_13(): Rule {
  return (_tree: Tree, context: SchematicContext): Rule => {
    context.addTask(new NodePackageInstallTask());
    return chain([removeWidgetMapHoverOption(), onMigrationComplete('0.13', context)]);
  };
}
