export interface Node {
  id: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    w: number;
    h: number;
  };
  next: Node[];
  prev: Node[];
}

interface Config {
  gap: {
    x: number;
    y: number;
  };
}

export const config: Config = {
  gap: {
    x: 4,
    y: 4,
  },
};

interface DimensionsFlow {
  flow: {
    l: number;
    r: number;
    h: number;
  };
  forks: Record<string, DimensionsFork>;
}

interface DimensionsFork {
  fork: {
    l: number;
    r: number;
    h: number;
  };
  flows: Record<string, DimensionsFlow>;
}

export function autoLayout(root: Node): { l: number; r: number; h: number } {
  const dimensions = getDimensionsFlow(root);
  setPositions(root, { x: 0, y: 0 }, dimensions);
  return {
    l: dimensions.flow.l,
    r: dimensions.flow.r,
    h: dimensions.flow.h,
  };
}

function getDimensionsFlow(node: Node): DimensionsFlow {
  let h: number = 0;
  let l: number = 0;
  let r: number = 0;
  let current: Node = node;
  const stack: Node[] = [];
  const forks: Record<string, DimensionsFork> = {};
  while (true) {
    if (current.prev.length > 1) {
      const node = stack.pop() as Node;
      if (stack.length === 0) {
        removeConnections(node, current);
        forks[node.id] = getDimensionsFork(node);
        insertConnections(node, current);
        const fork = forks[node.id]!.fork;
        h = h + fork.h;
        if (node.next.length > 0) {
          h = h + config.gap.y;
        }
        l = Math.max(l, fork.l);
        r = Math.max(r, fork.r);
      }
    }
    if (stack.length === 0) {
      const size = {
        w: current.size.w,
        h: current.size.h,
      };
      h = h + size.h;
      if (current.prev.length > 0) {
        h = h + config.gap.y;
      }
      l = Math.max(l, size.w / 2);
      r = Math.max(r, size.w / 2);
    }
    if (current.next.length > 1) {
      stack.push(current);
    }
    if (current.next.length > 0) {
      current = current.next[0]!;
    } else {
      break;
    }
  }
  return {
    flow: { h, l, r },
    forks,
  };
}

function getDimensionsFork(node: Node): DimensionsFork {
  const flows: Record<string, DimensionsFlow> = {};
  let h: number = 0;
  let w: number = 0;
  let s: number = 0;
  let e: number = 0;
  for (let i = 0; i < node.next.length; i++) {
    flows[node.next[i]!.id] = getDimensionsFlow(node.next[i]!);
    const flow = flows[node.next[i]!.id]!.flow;
    h = Math.max(h, flow.h);
    w = w + flow.l + flow.r;
    if (i < node.next.length - 1) {
      w = w + config.gap.x;
    }
    if (i === 0) {
      s = flow.l;
    }
    if (i === node.next.length - 1) {
      e = w - flow.r;
    }
  }
  const l = (s + e) / 2;
  const r = w - l;
  return {
    fork: { h, l, r },
    flows,
  };
}

function setPositions(
  node: Node,
  position: {
    x: number;
    y: number;
  },
  dimensions: DimensionsFlow
) {
  let t: number = position.y;
  let current: Node = node;
  const stack: Node[] = [];
  while (true) {
    if (current.prev.length > 1) {
      const node = stack.pop() as Node;
      if (stack.length === 0) {
        removeConnections(node, current);
        const fork = dimensions.forks[node.id]!;
        let x = position.x + dimensions.flow.l - fork.fork.l;
        let y = t;
        if (node.next.length > 0) {
          y = y + config.gap.y;
        }
        for (let i = 0; i < node.next.length; i++) {
          const flow: DimensionsFlow = fork.flows[node.next[i]!.id]!;
          const position = { x, y };
          setPositions(node.next[i]!, position, flow);
          x += flow.flow.l + flow.flow.r + config.gap.x;
        }
        t = y + fork.fork.h;
        insertConnections(node, current);
      }
    }
    if (stack.length === 0) {
      const w = current.size.w;
      const x = position.x + dimensions.flow.l - w / 2;
      let y = t;
      if (current.prev.length > 0) {
        y = y + config.gap.y;
      }
      current.position.x = x;
      current.position.y = y;
      t = y + current.size.h;
    }
    if (current.next.length > 1) {
      stack.push(current);
    }
    if (current.next.length > 0) {
      current = current.next[0]!;
    } else {
      break;
    }
  }
}

function removeConnections(t: Node, b: Node): void {
  for (const node of t.next) node.prev.pop();
  for (const node of b.prev) node.next.pop();
}

function insertConnections(t: Node, b: Node): void {
  for (const node of t.next) node.prev.push(t);
  for (const node of b.prev) node.next.push(b);
}

const A: Node = {
  id: "A",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const B: Node = {
  id: "B",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const C: Node = {
  id: "C",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const D: Node = {
  id: "D",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const E: Node = {
  id: "E",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const F: Node = {
  id: "F",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const G: Node = {
  id: "G",
  position: { x: 0, y: 0 },
  size: { w: 12, h: 8 },
  next: [],
  prev: [],
};

const H: Node = {
  id: "H",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 8 },
  next: [],
  prev: [],
};

const I: Node = {
  id: "I",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const J: Node = {
  id: "J",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const K: Node = {
  id: "K",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

const L: Node = {
  id: "L",
  position: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
  next: [],
  prev: [],
};

A.next.push(B);
B.prev.push(A);

B.next.push(C);
C.prev.push(B);

A.next.push(D);
D.prev.push(A);

D.next.push(E);
E.prev.push(D);

E.next.push(F);
F.prev.push(E);

F.next.push(C);
C.prev.push(F);

D.next.push(G);
G.prev.push(D);

G.next.push(F);
F.prev.push(G);

A.next.push(H);
H.prev.push(A);

H.next.push(I);
I.prev.push(H);

I.next.push(J);
J.prev.push(I);

J.next.push(K);
K.prev.push(J);

K.next.push(C);
C.prev.push(K);

H.next.push(L);
L.prev.push(H);

L.next.push(K);
K.prev.push(L);

const { l, r, h } = autoLayout(A);

function printTitle(title: string) {
  const line = "━".repeat(title.length + 4);
  console.log(`\n${line}`);
  console.log(`┃ ${title} ┃`);
  console.log(`${line}\n`);
}

const nodes = { A, B, C, D, E, F, G, H, I, J, K, L };

printTitle("Dimensions");
console.table([
  { Name: "L", Value: l },
  { Name: "R", Value: r },
  { Name: "H", Value: h },
]);

printTitle("Nodes");
const formattedNodes = Object.entries(nodes).map(([key, node]) => ({
  Name: key,
  X: node.position.x,
  Y: node.position.y,
}));
console.table(formattedNodes);
