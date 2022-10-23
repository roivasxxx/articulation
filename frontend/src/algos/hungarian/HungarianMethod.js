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
    const valArray = [];
    for (let i = 0; i < matrixDims; i++) {
      zeroArray.push([]);
      valArray.push([]);
      for (let j = 0; j < matrixDims; j++) {
        const val = baseMatrix[i][j].value;
        zeroArray[i].push(val === 0 ? 0 : "_");
        valArray[i].push(val);
      }
    }
    console.log(zeroArray, valArray);

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
    const nonCovered = findNonCovered(zeroArray, cols, rows);
    console.log("Non covered 0s: ", nonCovered);
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
          if (zeroArray[nonRow][nonCol] === 0) {
            zeroArray[nonRow][nonCol] = "'";

            const starIndex = zeroArray[nonRow].indexOf("*");
            if (starIndex > -1) {
              cols[starIndex] = false;
              rows[nonRow] = true;
              break;
            } else {
              return false;
            }
          }
        }
      }
      return true;
    };
    while (findNonCovered(zeroArray, cols, rows).length > 0) {
      step1();
    }

    console.log(findNonCovered(zeroArray, cols, rows));
    console.log(isFinished(rows, cols), rows, cols);
    //step2
    //unstar all sz, star each pz, erase all pz
    //uncover all rows, cover every column with sz
    //if all columns covered - sz are result
    //else go to step1
    const step2 = () => {
      for (let i = 0; i < zeroArray.length; i++) {
        for (let j = 0; j < zeroArray.length; j++) {}
      }
    };

    //step3
    //find min of non covered elements
    //add min to all covered rows
    //subtract min from all non covered columns
    //go to step1
    const step3 = () => {
      const nonCoveredCols = findAllIndices(cols, false);
      const nonCoveredRows = findAllIndices(rows, false);
      const covered = findAllIndices(rows, true);
      const nonCoveredValues = [];
      for (const r of nonCoveredRows) {
        for (const c of nonCoveredCols) {
          nonCoveredValues.push(valArray[r][c]);
        }
      }
      const min = Math.min(...nonCoveredValues);
      for (const r of covered) {
        for (let i = 0; i < zeroArray.length; i++) {
          valArray[r][i] = valArray[r][i] + min;
        }
      }
      for (const c of nonCoveredCols) {
        for (let i = 0; i < zeroArray.length; i++) {
          valArray[i][c] = valArray[i][c] - min;
        }
      }
      for (let i = 0; i < zeroArray.length; i++) {
        for (let j = 0; j < zeroArray.length; j++) {
          const val = valArray[i][j];
          const z = zeroArray[i][j];
          if (val === 0) {
            if (z === "_") {
              zeroArray[i][j] = 0;
            }
          } else {
            if (z === 0) {
              zeroArray[i][j] = "_";
            }
          }
        }
      }
    };
    step3();
    console.log(valArray, zeroArray);
  };

  const isFinished = (rows, cols) => {
    let count = 0;
    rows.forEach((el) => {
      if (el) count++;
    });
    cols.forEach((el) => {
      if (el) count++;
    });
    return count === cols.length;
  };
  const findNonCovered = (matrix, cols, rows) => {
    const c = findAllIndices(cols, false);
    const r = findAllIndices(rows, false);
    const nonCovered = [];
    for (const nonR of r) {
      for (const nonC of c) {
        if (matrix[nonR][nonC] === 0) {
          nonCovered.push({ row: nonR, col: nonC });
        }
      }
    }
    return nonCovered;
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
