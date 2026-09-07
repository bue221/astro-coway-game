import { useCallback, useState } from "react";

type TGRID = number[][];

const generateEmptyGrid = (size: number): TGRID => {
  return Array.from({ length: size }, () => Array(size).fill(0));
};

const useGrid = (
  size: number
): {
  grid: TGRID;
  setGrid: React.Dispatch<React.SetStateAction<TGRID>>;
  toggleCell: (i: number, j: number) => void;
  generateEmptyGrid: (size: number) => TGRID;
} => {
  const [grid, setGrid] = useState<TGRID>(() => generateEmptyGrid(size));

  const toggleCell = useCallback((i: number, j: number) => {
    setGrid((current) => {
      if (!current[i] || current[i][j] === undefined) {
        return current;
      }

      const newGrid = current.map((row) => [...row]);
      newGrid[i][j] = newGrid[i][j] ? 0 : 1;
      return newGrid;
    });
  }, []);

  return { grid, setGrid, toggleCell, generateEmptyGrid };
};

export default useGrid;
