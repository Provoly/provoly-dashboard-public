export class XMLUtils {
  static find(childs: NodeListOf<ChildNode>, name: string) {
    for (let i = 0; i < childs.length; i++) {
      const node = childs[i];
      if (node.nodeName === name) {
        return node;
      }
    }
    return null;
  }

  static findAll(childs: NodeListOf<ChildNode>, name: string) {
    const result = [];
    for (let i = 0; i < childs.length; i++) {
      const node = childs[i];
      if (node.nodeName === name) {
        result.push(node);
      }
    }
    return result;
  }

  static findWith(childs: NodeListOf<ChildNode>, attribute: string, value: string) {
    for (let i = 0; i < childs.length; i++) {
      const node = childs[i];
      const attrNode = XMLUtils.find(node.childNodes, attribute);
      if (attrNode?.textContent === value) {
        return node;
      }
    }
    return null;
  }
}
