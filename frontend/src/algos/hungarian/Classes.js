export class CrossingElement {
  constructor(type, index, values, isCrossed = false) {
    this.index = index;
    this.type = type;
    this.values = values;
    this.isTicked = isTicked;
  }
}

export class BaseElement {
  constructor(value, row = null, col = null) {
    this.value = value;
    this.row = row;
    this.col = col;
  }
}
