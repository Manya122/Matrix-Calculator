import React, { useState } from 'react';

// Helper to generate a matrix of given size
const generateMatrix = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

const MatrixInput = ({ matrix, setMatrix, label }) => {
  const handleChange = (i, j, value) => {
    const updated = matrix.map((row, rowIdx) =>
      row.map((cell, colIdx) => (rowIdx === i && colIdx === j ? Number(value) : cell))
    );
    setMatrix(updated);
  };

  return (
    <div className="p-4">
      <h2>{label}</h2>
      {matrix.map((row, i) => (
        <div style={{ display: 'flex', gap: '8px' }} key={i}>
          {row.map((val, j) => (
            <input
              key={j}
              type="number"
              value={val}
              style={{ width: '40px' }}
              onChange={(e) => handleChange(i, j, e.target.value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const ResultDisplay = ({ result }) => (
  <div style={{ marginTop: '20px', background: '#f1f5f9', padding: '1rem' }}>
    <h2>Result:</h2>
    {result.map((row, i) => (
      <div style={{ display: 'flex', gap: '8px' }} key={i}>
        {row.map((val, j) => (
          <div key={j} style={{ width: '40px', textAlign: 'center', border: '1px solid #ccc' }}>
            {val}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default function App() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);

  const [matrixA, setMatrixA] = useState(generateMatrix(rowsA, colsA));
  const [matrixB, setMatrixB] = useState(generateMatrix(rowsB, colsB));
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(null);

  const handleSizeChange = (matrix, type, value) => {
  const intVal = Number(value);

  if (matrix === 'A') {
    const updatedRows = type === 'rows' ? intVal : rowsA;
    const updatedCols = type === 'cols' ? intVal : colsA;
    setRowsA(updatedRows);
    setColsA(updatedCols);
    setMatrixA(generateMatrix(updatedRows, updatedCols));
  }

  if (matrix === 'B') {
    const updatedRows = type === 'rows' ? intVal : rowsB;
    const updatedCols = type === 'cols' ? intVal : colsB;
    setRowsB(updatedRows);
    setColsB(updatedCols);
    setMatrixB(generateMatrix(updatedRows, updatedCols));
  }
};


  const calculate = async () => {
    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrixA, matrixB, operation })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Matrix Calculator</h1>

      {/* Size Selectors */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        <div>
          <h3>Matrix A Size</h3>
          Rows:
          <input type="number" min={1} max={10} value={rowsA} onChange={(e) => handleSizeChange('A', 'rows', e.target.value)} />
          Columns:
          <input type="number" min={1} max={10} value={colsA} onChange={(e) => handleSizeChange('A', 'cols', e.target.value)} />
        </div>

        <div>
          <h3>Matrix B Size</h3>
          Rows:
          <input type="number" min={1} max={10} value={rowsB} onChange={(e) => handleSizeChange('B', 'rows', e.target.value)} />
          Columns:
          <input type="number" min={1} max={10} value={colsB} onChange={(e) => handleSizeChange('B', 'cols', e.target.value)} />
        </div>
      </div>

      {/* Matrix Inputs */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <MatrixInput matrix={matrixA} setMatrix={setMatrixA} label="Matrix A" />
        <MatrixInput matrix={matrixB} setMatrix={setMatrixB} label="Matrix B" />
      </div>

      {/* Operation Selection */}
      <div style={{ marginTop: '1rem' }}>
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="add">Addition (A + B)</option>
          <option value="subtract">Subtraction (A - B)</option>
          <option value="multiply">Multiplication (A × B)</option>
          <option value="transposeA">Transpose A</option>
          <option value="transposeB">Transpose B</option>
        </select>
        <button onClick={calculate} style={{ marginLeft: '1rem' }}>Calculate</button>
      </div>

      {/* Result */}
      {result && <ResultDisplay result={result} />}
    </div>
  );
}
