export class CrossingElement {
  constructor(row, column, isTicked = false) {
    this.row = row;
    this.column = column;
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
