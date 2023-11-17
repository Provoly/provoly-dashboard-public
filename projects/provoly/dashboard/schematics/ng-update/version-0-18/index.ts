import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { onMigrationComplete } from '../utils/complete.function';

export function updateTo0_18(): Rule {
  return (_tree: Tree, context: SchematicContext): Rule => {
    context.addTask(new NodePackageInstallTask());
    context.logger.info(`  ✓  Please manually change autoLoadDatasource to 'aggregate' for widget-aggregated-chart`);
    return chain([onMigrationComplete('0.18', context)]);
  };
}
