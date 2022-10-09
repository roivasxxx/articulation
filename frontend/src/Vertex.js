export class Vertex {
  constructor(neighbours) {
    this.neigh = neighbours;
  }
}

export class LifoElement {
  /**
   *
   * @param {string} key
   * @param {number} pos
   * @param {Array[number]} min
   */
  constructor(key, pos, min, isRoot = false) {
    this.key = key;
    this.pos = pos;
    this.min = min;
    this.isRoot = isRoot;
  }
}

export class Edge {
  constructor(text, isBack) {
    this.text = text;
    this.isBack = isBack;
  }
}
