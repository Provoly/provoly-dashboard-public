import { noop, Rule, SchematicContext } from '@angular-devkit/schematics';

export function onMigrationComplete(targetVersion: string, context: SchematicContext): Rule {
  context.logger.info(`  ✓  Updated @provoly/dashboard to ${targetVersion}`);
  return noop;
}
