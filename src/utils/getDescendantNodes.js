export default function getDescendantNodes(node, all = []) {
    all.push(...node.childNodes);
    for (const child of node.childNodes)
        getDescendantNodes(child, all);
    return all;
}