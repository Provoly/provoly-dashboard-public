import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { onMigrationComplete } from '../utils/complete.function';
import { replaceStrings } from '../utils/replaceStrings.function';

function updateLegendUrlPipeUsage() {
  return function (tree: Tree, context: SchematicContext) {
    tree.visit((path, entry) => {
      if (path.includes('.html')) {
        const buffer = tree.read(path);
        if (buffer) {
          tree.overwrite(path, buffer.toString().replace(/\|\s*legendUrl/g, '| legendUrl | async'));
        }
      }
    });
    return undefined;
  };
}

function replaceSelectionInteractionWithInteractionManager() {
  return function (tree: Tree, context: SchematicContext) {
    tree.visit((path, entry) => {
      if (path.includes('.html') || path.includes('.ts')) {
        const buffer = tree.read(path);
        const replaceValues = [
          { searchValue: /selectionInteraction(\.)+/g, replaceValue: 'interactionManager$1selectionInteraction$1' },
          { searchValue: /selectionInteraction(\s)+/g, replaceValue: 'interactionManager$1' },
          { searchValue: /new(\s)*SelectionInteraction/g, replaceValue: 'new$1InteractionManager' }
        ];
        if (buffer) replaceStrings(tree, path, buffer, replaceValues);
      }
    });
    return tree;
  };
}

export function updateTo0_14(): Rule {
  return (_tree: Tree, context: SchematicContext): Rule => {
    context.addTask(new NodePackageInstallTask());
    return chain([
      updateLegendUrlPipeUsage(),
      replaceSelectionInteractionWithInteractionManager(),
      onMigrationComplete('0.14', context)
    ]);
  };
}
