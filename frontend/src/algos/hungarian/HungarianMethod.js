import React from "react";
import { BaseElement, CrossingElement } from "./Classes";

export default function HungarianMethod() {
  const matrixDims = 4;
  const matrixValues = [
    [22, 16, 25, 20],
    [20, 15, 20, 16],
    [18, 15, 16, 20],
    [25, 20, 22, 21],
  ];
  const baseMatrix = [];
  for (let i = 0; i < matrixDims; i++) {
    baseMatrix.push([]);
    for (let j = 0; j < matrixDims; j++) {
      baseMatrix[i].push(new BaseElement(matrixValues[i][j], i, j));
    }
  }
  const handleClick = () => {
    //first we substract each row by its min
    for (let i = 0; i < matrixDims; i++) {
      const min = findMin(0, i);
      baseMatrix[i].forEach((el, index) => {
        const value = baseMatrix[i][index].value;
        baseMatrix[i][index].value = value - min;
      });
    }
    //then we subtract each column by its min
    for (let i = 0; i < matrixDims; i++) {
      const min = findMin(1, i);
      for (let j = 0; j < matrixDims; j++) {
        const value = baseMatrix[j][i].value;
        baseMatrix[j][i].value = value - min;
      }
    }
    console.log(baseMatrix);
  };

  const findMin = (variation, index) => {
    //0-row 1-column 2-matrix
    if (variation === 0) {
      const vals = baseMatrix[index].map((el) => el.value);
      return Math.min(...vals);
    } else if (variation === 1) {
      const indices = [...new Array(matrixDims).keys()];

      const column = [
        ...Array.from(indices, (x) => baseMatrix[x][index].value),
      ];
      console.log(Math.min(...column));
      return Math.min(...column);
    } else if (variation === 2) {
      //todo
    }
  };

  const findZeroes = (variation, index) => {
    //returns all zero values in row/column
    const indicesArray = [];
    if (variation === 0) {
      //row
      baseMatrix[index].forEach((el, index) => {
        if (el.value === 0) indicesArray.push(index);
      });
    } else {
      //column
      for (let i = 0; i < matrixDims; i++) {
        if (baseMatrix[i][index].value === 0) indicesArray.push(i);
      }
    }
    return indicesArray;
  };

  return (
    <div>
      <button onClick={() => handleClick()}>Solve</button>
    </div>
  );
}
