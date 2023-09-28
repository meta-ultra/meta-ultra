import { createElement, useMemo } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { useCache } from "@meta-ultra/cache";

interface MenuNode {
  id: string;
  label: string;
  children?: MenuNode[];
}

interface BreadcrumbNode {
  id: string;
  label: string;
}

const assembleBreadcrumbNodes = (
  id: string,
  menuNodes: MenuNode[],
  breadcrumbNodes: BreadcrumbNode[]
): void => {
  const hasChildren = [];
  for (const menuNode of menuNodes) {
    if (menuNode.id === id) {
      breadcrumbNodes.push({ id, label: menuNode.label });
      return;
    } else if (menuNode.children && menuNode.children.length) {
      hasChildren.push(menuNode);
    }
  }

  for (const menuNode of hasChildren) {
    breadcrumbNodes.push({ id: menuNode.id, label: menuNode.label });
    const oLength = breadcrumbNodes.length;
    assembleBreadcrumbNodes(
      id,
      menuNode.children as MenuNode[],
      breadcrumbNodes
    );
    if (breadcrumbNodes.length === oLength) {
      breadcrumbNodes.pop();
    }
  }
};

const useBreadcrumb = (id: string, cacheKey: string) => {
  const cache = useCache();
  const menuNodes = cache.get(cacheKey) as MenuNode[] | undefined;

  return useMemo(() => {
    const breadcrumbNodes: BreadcrumbNode[] = [];
    if (!menuNodes) {
      console.error("[useBreadcrumb] cache is missed.");

      return [];
    }

    assembleBreadcrumbNodes(id, menuNodes, breadcrumbNodes);

    return [
      { title: createElement(AiOutlineHome, { size: 20 }) },
      ...breadcrumbNodes.map(({ label }) => ({ title: label })),
    ];
  }, [id, menuNodes]);
};

export type { MenuNode, BreadcrumbNode };
export default useBreadcrumb;
