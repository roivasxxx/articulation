import React, { useState } from "react";
import "./styles.css";
import * as vh from "./Vertex";
export default function App() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const [vertices, setVertices] = useState({});

  const initVertices = (amount) => {
    if (amount <= 0) return;
    const num = Number.parseInt(amount);
    const arr = new Array(num).fill(0);
    const tempVer = {};
    for (let i = 0; i < num; i++) {
      tempVer[alphabet[i]] = arr;
    }
    setVertices(tempVer);
  };

  const handleClick = (key, index) => {
    console.log(key, index);
    const tempVer = { ...vertices };
    const currentVal = [...tempVer[key]];
    currentVal[index] = currentVal[index] === 0 ? 1 : 0;

    tempVer[key] = currentVal;
    setVertices(tempVer);
  };

  const solve = () => {
    const lifo = [];
    let currentPos = 0;
    const edges = [];
    const keys = Object.keys(vertices);
    let tempVer = {};
    for (const key of keys) {
      tempVer[key] = [...vertices[key]];
    }
    let firstVertex;
    for (const key of keys) {
      const index = tempVer[key].indexOf(1);
      if (index >= 0) {
        firstVertex = key;
        break;
      }
    }
    lifo.push(new vh.LifoElement(firstVertex, currentPos, currentPos, true));
    currentPos++;

    const dfsFinished = false;

    while (!isDfsFinished(tempVer)) {
      const lifoIndex = lifo.length - 1;
      const lifoElem = lifo[lifoIndex];
      const nextVertexIndex = findNonNullEdge(lifoElem, tempVer);
      if (nextVertexIndex > -1) {
        const nextVertexKey = alphabet[nextVertexIndex];
        const elemInLifo = findInLifo(nextVertexKey, lifo);
        if (!elemInLifo) {
          lifo.push(new vh.LifoElement(nextVertexKey, currentPos, currentPos));
          currentPos++;
          edges.push(new vh.Edge(`${lifoElem.key}${nextVertexKey}`, false));
        } else {
          lifoElem.min = elemInLifo.pos;
          edges.push(new vh.Edge(`${lifoElem.key}${nextVertexKey}`, true));
        }
        tempVer = zeroOutValues(
          lifoElem,
          nextVertexIndex,
          nextVertexKey,
          tempVer
        );
      } else {
        console.log("nowhere else to go");
        const popped = lifo.pop();
        console.log("Popped: ", popped);
        const afterPopIndex = lifo.length - 1;
        const afterPopLastElem = lifo[afterPopIndex];
        if (afterPopLastElem.min < popped.min) {
          afterPopLastElem.min = popped.min;
        }
        if (afterPopLastElem.pos <= popped.min && !afterPopLastElem.isRoot) {
          console.log("found articulation: ", afterPopLastElem);
        }
        if (afterPopLastElem.isRoot) {
          let directRootChildCount = 0;
          for (const edge of edges) {
            if (edge.text[0] === afterPopLastElem.key) directRootChildCount++;
          }
          if (directRootChildCount >= 2) {
            console.log(
              "found articulation, which is the root element: ",
              afterPopLastElem.key
            );
          }
        }
      }
    }

    //push first vertex into lifo
    //push first edge into edges []
    console.log(lifo, edges, tempVer);
    //edges.push(`${firstEdge.x}${firstEdge.y}`);
  };

  const zeroOutValues = (lifoElem, nextIndex, nextVertexKey, vertices) => {
    const tempVer = { ...vertices };
    const firstVertex = tempVer[lifoElem.key];
    const firstIndex = alphabet.indexOf(lifoElem.key);
    firstVertex[nextIndex] = 0;
    const secondVertex = tempVer[nextVertexKey];
    secondVertex[firstIndex] = 0;
    return tempVer;
  };

  const isDfsFinished = (vertices) => {
    const keys = Object.keys(vertices);
    for (const key of keys) {
      if (vertices[key].some((el) => el === 1)) return false;
    }
    return true;
  };

  const findInLifo = (key, lifo) => {
    return lifo.find((el) => el.key === key);
  };

  const findNonNullEdge = (lifoElem, vertices) => {
    const neighbours = vertices[lifoElem.key];
    const index = neighbours.indexOf(1);
    return index;
  };

  const findFirstEdge = () => {
    const keys = Object.keys(vertices);
    for (let i = 0; i < keys.length; i++) {
      const index = vertices[keys[i]].indexOf(1);
      if (index >= 0) {
        return { x: keys[i], y: alphabet[index] };
      }
    }
    return null;
  };

  return (
    <div>
      <div>
        <input type="number" onChange={(e) => initVertices(e.target.value)} />
        <table id="matrixTable">
          <tbody>
            <tr>
              {["", ...Object.keys(vertices)].map((key) => {
                return <td key={`row-${key}`}>{key}</td>;
              })}
            </tr>
            {Object.keys(vertices).map((key) => {
              return (
                <tr key={`col-${key}`}>
                  <td>{key}</td>
                  {vertices[key].map((el, index) => {
                    return (
                      <td key={`col-${index}-${el}`}>
                        <button
                          className="itemButton"
                          onClick={() => handleClick(key, index)}
                        >
                          {el || " "}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="row"></div>
        <button onClick={() => solve()}>Vyřešit</button>
      </div>
    </div>
  );
}
