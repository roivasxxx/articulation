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

    const rows = new Array(matrixDims).fill(false);
    const cols = new Array(matrixDims).fill(false);
    const zeroArray = [];
    for (let i = 0; i < matrixDims; i++) {
      zeroArray.push([]);
      for (let j = 0; j < matrixDims; j++) {
        const val = baseMatrix[i][j].value;
        zeroArray[i].push(val === 0 ? 0 : "_");
      }
    }
    console.log(zeroArray);

    // const rows = [];
    // const cols = [];
    // let assigned = [];
    // baseMatrix.forEach((el, index) => {
    //   rows.push(
    //     new CrossingElement(
    //       0,
    //       index,
    //       el.map((el) => el.value)
    //     )
    //   );
    //   const tempCol = [];
    //   for (let i = 0; i < matrixDims; i++) {
    //     tempCol.push(baseMatrix[i][index].value);
    //   }
    //   cols.push(new CrossingElement(1, index, tempCol));
    // });
    // console.log(rows);
    // console.log(cols);

    //zero-z , starred zero - sz, primed zero - pz
    //on a given row that has zeroes
    //if there is no sz in row or in column, star the first z
    //repeat for all rows, cover every column with sz
    for (let i = 0; i < matrixDims; i++) {
      for (let j = 0; j < matrixDims; j++) {
        const el = zeroArray[i][j];
        const temp = getCol(zeroArray, j);
        if (el === 0 && !zeroArray[i].includes("*") && !temp.includes("*")) {
          zeroArray[i][j] = "*";
          cols[j] = true;
          break;
        }
      }
    }

    //step1
    //check if non covered zeroes exist in matrix
    //if there is no sz in row go to step2
    //if there is a sz in row, cover this row, uncover column of sz
    //repeat till al z are covered and go to step3
    const step1 = () => {
      const nonCoveredCols = findAllIndices(cols, false);
      const nonCoveredRows = findAllIndices(rows, false);

      for (const nonRow of nonCoveredRows) {
        for (const nonCol of nonCoveredCols) {
          if (zeroArray[nonRow][nonCol] === 0) zeroArray[nonRow][nonCol] = "'";
          const starIndex = zeroArray[i].indexOf("*");
          if (starIndex > 0) {
            cols[starIndex] = false;
            rows[i] = true;
          } else {
            return false;
          }
        }
      }
      return true;
    };

    //step2
    //unstar all sz, star each pz, erase all pz
    //uncover all rows, cover every column with sz
    //if all columns covered - sz are result
    //else go to step1

    //step3
    //find min of non covered elements
    //add min to all covered rows
    //subtract min from all non covered columns
    //go to step1
  };

  const nonCoveredExist = (matrix, cols) => {
    const nonCovered = findAllIndices(matrix, false);
    for (let i = 0; matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {}
    }
  };

  const getCol = (matrix, index) => {
    const temp = [];
    for (let i = 0; i < matrix.length; i++) {
      temp.push(matrix[i][index]);
    }
    return temp;
  };
  const findAllIndices = (array, value) => {
    const temp = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) temp.push(i);
    }
    return temp;
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

  const findZeroes = (values, variation = 0) => {
    const indices = [];
    for (let i = 0; i < matrixDims; i++) {
      if (values[i] === 0) indices.push(i);
    }
    return indices;
  };

  // const findZeroes = (variation, index) => {
  //   //returns all zero values in row/column
  //   const indicesArray = [];
  //   if (variation === 0) {
  //     //row
  //     baseMatrix[index].forEach((el, index) => {
  //       if (el.value === 0) indicesArray.push(index);
  //     });
  //   } else {
  //     //column
  //     for (let i = 0; i < matrixDims; i++) {
  //       if (baseMatrix[i][index].value === 0) indicesArray.push(i);
  //     }
  //   }
  //   return indicesArray;
  // };

  return (
    <div>
      <button onClick={() => handleClick()}>Solve</button>
    </div>
  );
}
