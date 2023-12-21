import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { onMigrationComplete } from '../utils/complete.function';
import { removePackageJsonDependency } from '@schematics/angular/utility/dependencies';

function removeUselessDeps(tree: Tree) {
  removePackageJsonDependency(tree, 'ng-select');
}

export function updateTo0_20(): Rule {
  return (_tree: Tree, context: SchematicContext): Rule => {
    removeUselessDeps(_tree);
    context.addTask(new NodePackageInstallTask());
    return chain([onMigrationComplete('0.20', context)]);
  };
}
