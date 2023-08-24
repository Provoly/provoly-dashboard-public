export function getFileContent(tree, filePath) {
    const contentBuffer = tree.read(filePath);
    if (!contentBuffer) {
        throw new Error(`Cannot read "${filePath}" because it does not exist.`);
    }
    return contentBuffer.toString();
}
//# sourceMappingURL=file-contents.function.js.map