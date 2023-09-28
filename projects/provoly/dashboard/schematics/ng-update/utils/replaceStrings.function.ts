import { Tree } from '@angular-devkit/schematics';
import { Path } from '@angular-devkit/core';

export function replaceStrings(
  tree: Tree,
  path: Path,
  buffer: Buffer | null,
  values: { searchValue: string | RegExp; replaceValue: string }[]
): void {
  if (values.length === 0) return;
  const value = values.pop();
  if (buffer) tree.overwrite(path, buffer.toString().replace(value!.searchValue, value!.replaceValue));
  buffer = tree.read(path);
  if (buffer) replaceStrings(tree, path, buffer, values);
}
