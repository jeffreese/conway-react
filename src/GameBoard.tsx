import React, { useState, useCallback } from 'react'
import useInterval from './useInterval'

const numRows = 50
const numCols = 50

// Initialize grid
const createEmptyGrid = () => {
  const rows = []
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

const produceNextGeneration = (grid: number[][]) => {
  const nextGrid = createEmptyGrid()

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let neighbors = 0
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          if (k === 0 && l === 0) continue
          const x = i + k
          const y = j + l
          if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
            neighbors += grid[x][y]
          }
        }
      }

      if (neighbors < 2 || neighbors > 3) {
        nextGrid[i][j] = 0
      } else if (grid[i][j] === 0 && neighbors === 3) {
        nextGrid[i][j] = 1
      } else {
        nextGrid[i][j] = grid[i][j]
      }
    }
  }

  return nextGrid
}

const GameBoard: React.FC = () => {
  const [grid, setGrid] = useState(() => createEmptyGrid())
  const [running, setRunning] = useState(false)

  useInterval(() => {
    if (!running) return

    setGrid((currentGrid) => {
      return produceNextGeneration(currentGrid)
    })
  }, 100)

  const toggleCellState = (row: number, col: number) => {
    const newGrid = [...grid]
    newGrid[row][col] = grid[row][col] ? 0 : 1
    setGrid(newGrid)
  }

  return (
    <div>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => toggleCellState(i, k)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? 'black' : undefined,
                border: 'solid 1px black',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default GameBoard
