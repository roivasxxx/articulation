import React, { useState } from "react";
import { BaseElement, CrossingElement } from "./Classes";
import { HUNG_STEPS } from "../../utils";
import * as testMatrices from "../../test/HungarianMethodTest";

export default function HungarianMethod() {
  const [matrix, setMatrix] = useState(testMatrices.m3);

  const handleClick = () => {
    const matrixDims = matrix.length;
    const steps = [];
    const rows = new Array(matrixDims).fill(false);
    const cols = new Array(matrixDims).fill(false);
    const zeroArray = [];
    const valArray = [];

    matrix.forEach((r) => {
      valArray.push([...r]);
    });

    const copyMatrix = (val = 0) => {
      const temp = [];
      if (val === 0) {
        valArray.forEach((r) => {
          temp.push([...r]);
        });
      } else {
        zeroArray.forEach((_, i) => {
          const col = getCol(zeroArray, i);
          temp.push([...col]);
        });
      }
      return temp;
    };
    //first we substract each row by its min
    for (let i = 0; i < matrixDims; i++) {
      const min = findMin(0, i, valArray);
      valArray[i].forEach((el, index) => {
        const value = valArray[i][index];
        valArray[i][index] = value - min;
      });
    }
    steps.push({ matrix: copyMatrix(), action: HUNG_STEPS[0] });
    //then we subtract each column by its min
    for (let i = 0; i < matrixDims; i++) {
      const min = findMin(1, i, valArray);
      for (let j = 0; j < matrixDims; j++) {
        const value = valArray[j][i];
        valArray[j][i] = value - min;
      }
    }
    steps.push({ matrix: copyMatrix(), action: HUNG_STEPS[1] });
    for (let i = 0; i < matrixDims; i++) {
      zeroArray.push([]);
      for (let j = 0; j < matrixDims; j++) {
        const val = valArray[i][j];
        zeroArray[i].push(val === 0 ? 0 : "_");
      }
    }

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
    steps.push({
      matrix: copyMatrix(),
      action: HUNG_STEPS[2],
      cols: [...cols],
      rows: [...rows],
    });

    //step1
    //check if non covered zeroes exist in matrix
    //if there is no sz in row go to step2
    //if there is a sz in row, cover this row, uncover column of sz
    //repeat till al z are covered and go to step3

    const step1 = () => {
      //check if non covered zeroes exist
      //row and cols are covered/uncovered(changed) so uncovered zeroes also change!
      //cant just use two loops that check non covered zeroes before step1 runs
      let allZeroesCovered = false;
      while (!allZeroesCovered) {
        const nonCoveredCols = findAllIndices(cols, false);
        const nonCoveredRows = findAllIndices(rows, false);
        const uncoveredZeroes = [];
        for (const nonRow of nonCoveredRows) {
          for (const nonCol of nonCoveredCols) {
            if (zeroArray[nonRow][nonCol] === 0) {
              uncoveredZeroes.push({ nonRow, nonCol });
              break;
            }
          }
          if (uncoveredZeroes.length > 0) break;
        }
        if (uncoveredZeroes.length === 0) break;
        const { nonRow, nonCol } = uncoveredZeroes[0];
        const zeroRow = zeroArray[nonRow];
        const starIndex = zeroRow.indexOf("*");
        if (starIndex > -1) {
          zeroArray[nonRow][nonCol] = "'";
          cols[starIndex] = false;
          rows[nonRow] = true;
        } else {
          console.log("found uncovered zero with no star in its row");
          return { row: nonRow, column: nonCol };
        }
      }

      return true;
    };
    //step2
    //unstar all sz, star each pz, erase all pz
    //uncover all rows, cover every column with sz
    //if all columns covered - sz are result
    //else go to step1
    const step2 = (row, column) => {
      const alterZeroSeq = [];
      alterZeroSeq.push({ zero: "'", row, column });

      while (true) {
        const lastIndex = alterZeroSeq.length - 1;
        const lastZero = alterZeroSeq[lastIndex];
        if (lastZero.zero === "'") {
          const col = getCol(zeroArray, lastZero.column);
          const nextZeroIndex = col.indexOf("*");
          if (nextZeroIndex === -1) break;
          alterZeroSeq.push({
            zero: "*",
            row: nextZeroIndex,
            column: lastZero.column,
          });
        } else if (lastZero.zero === "*") {
          const nextZeroIndex = zeroArray[lastZero.row].indexOf("'");
          if (nextZeroIndex === -1) break;
          alterZeroSeq.push({
            zero: "'",
            row: lastZero.row,
            column: nextZeroIndex,
          });
        }
      }

      for (const el of alterZeroSeq) {
        if (el.zero === "'") {
          zeroArray[el.row][el.column] = "*";
        } else if (el.zero === "*") {
          zeroArray[el.row][el.column] = 0;
        }
      }
      const tempCols = copyMatrix(1);
      tempCols.forEach((el, i) => {
        cols[i] = el.includes("*");
        rows[i] = false;
      });

      if (cols.every((el) => el)) {
        steps.push({
          matrix: copyMatrix(),
          action: HUNG_STEPS[3],
          rows: [...rows],
          cols: [...cols],
          zeroMatrix: copyMatrix(1),
        });
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
      steps.push({
        matrix: copyMatrix(),
        action: HUNG_STEPS[3],
        rows: [...rows],
        cols: [...cols],
        zeroMatrix: copyMatrix(1),
      });
    };

    while (cols.some((el) => !el)) {
      const step1Result = step1();
      console.log("step1 result: ", step1Result);
      if (step1Result === true) step3();
      else step2(step1Result.row, step1Result.column);
    }
    console.log("finished");
    const result = [];
    zeroArray.forEach((el, index) => {
      const starIndex = el.indexOf("*");
      result.push({ row: index, column: starIndex });
    });
    console.log(steps);
    steps[steps.length - 1].result = result;
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

  const findMin = (variation, index, baseMatrix) => {
    //0-row 1-column 2-matrix
    if (variation === 0) {
      const vals = baseMatrix[index];
      return Math.min(...vals);
    } else if (variation === 1) {
      const indices = [...new Array(baseMatrix.length).keys()];

      const column = [...Array.from(indices, (x) => baseMatrix[x][index])];
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

  return (
    <div>
      <button onClick={() => handleClick()}>Solve</button>
    </div>
  );
}
