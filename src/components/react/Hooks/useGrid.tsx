import { useState } from "react";

type TGRID = number[][];

const useGrid = (
  size: number
): {
  grid: TGRID;
  setGrid: React.Dispatch<React.SetStateAction<TGRID>>;
  toggleCell: (i: number, j: number) => void;
  generateEmptyGrid: (size: number) => TGRID;
} => {
  const generateEmptyGrid = (size: number) => {
    return Array.from({ length: size }, () => Array(size).fill(0));
  };

  const [grid, setGrid] = useState<TGRID>(() => generateEmptyGrid(size));

  const toggleCell = (i: number, j: number) => {
    setGrid((grid) => {
      const newGrid = grid.map((row) => [...row]);
      newGrid[i][j] = newGrid[i][j] ? 0 : 1;
      return newGrid;
    });
  };

  return { grid, setGrid, toggleCell, generateEmptyGrid };
};

export default useGrid;
