import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [directed, setDirected] = useState(true);
  const [graphInput, setGraphInput] = useState('');
  const [result, setResult] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [matrix, setMatrix] = useState(null);
  const [vertix, setVertix] = useState('');
  const [vertix1, setVertix1] = useState('');
  const [vertix2, setVertix2] = useState('');
  const [isAdjacent, setIsAdjacent] = useState(null);
  const [adjacents, setAdjacents] = useState(null);

  useEffect(() => {
    if (graphInput.length > 0) {
      setResult(false);
      setNodes([]);
      setEdges([]);
      setMatrix(null);
    }
  }, [graphInput]);

  useEffect(() => {
    if (result) {
      getMatrix();
    }
  }, [result]);

  const addNewNode = (value) => {
    setNodes((prevState) => [...prevState, value]);
  };

  const addNewEdge = (value) => {
    setEdges((prevState) => [...prevState, value]);
  };

  const setGraph = () => {
    let lines = graphInput.split(/\r?\n/);
    lines.forEach((line) => {
      const elem = line.split(' ');
      if (elem.length === 1) {
        addNewNode(elem[0]);
      } else if (elem.length === 2) {
        addNewEdge({
          from: elem[0],
          to: elem[1],
          distance: '?',
        });
      } else {
        addNewEdge({
          from: elem[0],
          to: elem[1],
          distance: parseInt(elem[2]),
        });
      }
    });
  };

  const generateResult = () => {
    setNodes([]);
    setEdges([]);
    setMatrix(null);
    setGraph();
    setResult(true);
  };

  const resultInfo = () => {
    if (result) {
      return (
        <p className='result'>
          <b>{directed ? 'Direcionado' : 'Não direcionado'}</b>
          <br></br>
          <b>Vértices: </b>
          {nodes.map((node, index) => {
            if (index !== nodes.length - 1) {
              return node + ', ';
            }
            return node;
          })}
          <br></br>
          <b>Arestas: </b>
          {edges.map((edge, index) => {
            const connector = directed ? 'para' : '-';
            return (
              <span key={index}>
                <br></br>
                <span>{`• ${edge.from} ${connector} ${edge.to} (${edge.distance})`}</span>
              </span>
            );
          })}
          <br></br>
          <b>Ordem: </b>
          {nodes.length}
          <br></br>
          <b>Tamanho: </b>
          {edges.length}
        </p>
      );
    }
  };

  const getMatrix = () => {
    let matrix = [];
    let nodesHeader = nodes;
    nodesHeader.unshift(' ');
    matrix.push(nodesHeader);
    for (let i = 1; i < nodes.length; i++) {
      let line = [];
      nodes.map((node) => line.push('-'));
      line[0] = nodes[i];
      for (let index = 0; index < edges.length; index++) {
        const e = edges[index];
        if (e.from === nodes[i]) {
          let indexTes = nodes.findIndex((ele) => ele === e.to);
          line[indexTes] = e.distance;
        }
      }
      if (!directed) {
        for (let index = 0; index < edges.length; index++) {
          const e = edges[index];
          if (e.to === nodes[i]) {
            let indexTes = nodes.findIndex((ele) => ele === e.from);
            line[indexTes] = e.distance;
          }
        }
      }
      matrix.push(line);
    }
    console.table(matrix);
    setMatrix(matrix);
  };

  const isAdjNodes = () => {
    setIsAdjacent(
      edges.filter(
        (edge) =>
          (edge.from === vertix1 && edge.to === vertix2) ||
          (edge.from === vertix2 && edge.to === vertix1)
      ).length > 0
    );
    setVertix1('');
    setVertix2('');
  };

  const getAdjacents = () => {
    const isDirected = directed;
    let adjNodes = {
      in: [],
      out: [],
    };
    edges.forEach((edge) => {
      if (edge.to === vertix && !adjNodes.in.includes(edge.from)) {
        adjNodes.in.push(edge.from);
      } else if (edge.from === vertix && !adjNodes.out.includes(edge.to)) {
        adjNodes.out.push(edge.to);
      }
    });
    setAdjacents(isDirected ? adjNodes : [...adjNodes.in, adjNodes.out]);
    console.log(adjacents, 'adj');
  };

  const firstColumn = (
    <div className='column'>
      <div className='graph-input'>
        <label htmlFor='graph'>Grafo*</label>
        <textarea
          name='graph'
          cols='30'
          rows='10'
          placeholder={`Exemplo:\na\nb\nc\na b 1\nb c 2`}
          value={graphInput}
          onChange={(event) => setGraphInput(event.target.value)}
        ></textarea>
      </div>
      <div className='graph-directed'>
        <input
          type='checkbox'
          name='directed'
          checked={directed}
          onChange={() => setDirected(!directed)}
        />
        <label htmlFor='directed'>Direcionado</label>
      </div>
      <button className='result-btn' onClick={generateResult}>
        Gerar resultado
      </button>
    </div>
  );

  const secondColumn = (
    <div className='column'>
      <h1 className='result-title'>Resultado</h1>
      <div className='result-container'>{resultInfo()}</div>
      <div className='graph-table'>
        {matrix && (
          <table className='table'>
            <tbody>
              {matrix.map((line, index) => {
                return (
                  <tr key={index}>
                    {line.map((item, index) => (
                      <td key={index}>{item}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const thirdColumn = (
    <div className='column'>
      <div className='adjacents'>
        <p>
          São adjacentes?{' '}
          {isAdjacent ? 'Sim!' : isAdjacent === null ? '' : 'Não!'}{' '}
        </p>
        <div className='vertix'>
          <label htmlFor='v1'>Vértice 1</label>
          <input
            type='text'
            value={vertix1}
            onChange={(e) => setVertix1(e.target.value)}
          />
        </div>
        <div className='vertix'>
          <label htmlFor='v2'>Vértice 2</label>
          <input
            type='text'
            value={vertix2}
            onChange={(e) => setVertix2(e.target.value)}
          />
        </div>
        <button className='check-btn' onClick={isAdjNodes}>
          CHECAR
        </button>
      </div>
      <div className='adjacents-list'>
        <p>Vértices adjacentes</p>
        <div className='vertix'>
          <label htmlFor='vertix'>Vértice</label>
          <input
            type='text'
            value={vertix}
            onChange={(e) => setVertix(e.target.value)}
          />
        </div>
        <div className='result-container'>
          {adjacents && (
            <>
              <b>Entrada: </b>
              {adjacents.in.map((elem, index) => (
                <div key={index}>
                  <span>{elem}</span>
                </div>
              ))}
              <br></br>
              <b>Saída: </b>
              {adjacents.out.map((elem, index) => (
                <div key={index}>
                  <span>{elem}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <button className='check-btn' onClick={getAdjacents}>
          CHECAR
        </button>
      </div>
    </div>
  );

  return (
    <div className='app'>
      <header className='header'>
        <h1>GraphsAreCool</h1>
      </header>
      <div className='container'>
        {firstColumn}
        {secondColumn}
        {thirdColumn}
      </div>
    </div>
  );
}

export default App;
