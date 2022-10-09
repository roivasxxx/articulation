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
  constructor(key, pos, min) {
    this.key = key;
    this.pos = pos;
    this.min = min;
  }
}

export class Edge {
  constructor(text, isBack) {
    this.text = text;
    this.isBack = isBack;
  }
}
