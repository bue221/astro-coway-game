import { useCallback, useRef, useState } from "react";
import { AROUND_CELLS, DEFAULT_GRID_SIZE } from "../../../lib/constants/game";
import useGrid from "../Hooks/useGrid";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";

const GameContainer = () => {
  const { grid, setGrid, toggleCell, generateEmptyGrid } =
    useGrid(DEFAULT_GRID_SIZE);

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [history, setHistory] = useState<any>([]);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (grid.every((row) => row.every((cell) => cell === 0))) {
      console.log("All cells are dead", grid);
      return;
    }

    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      const newGrid = g.map((row) => [...row]);
      for (let i = 0; i < DEFAULT_GRID_SIZE; i++) {
        for (let k = 0; k < DEFAULT_GRID_SIZE; k++) {
          let neighbors = 0;
          AROUND_CELLS.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;
            if (
              newI >= 0 &&
              newI < DEFAULT_GRID_SIZE &&
              newK >= 0 &&
              newK < DEFAULT_GRID_SIZE
            ) {
              neighbors += g[newI][newK];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][k] = 0;
          } else if (g[i][k] === 0 && neighbors === 3) {
            newGrid[i][k] = 1;
          }
        }
      }
      setHistory((history: any) => [...history, newGrid]);
      return newGrid;
    });

    setGeneration((generation) => generation + 1);

    setTimeout(runSimulation, 100);
  }, [grid]);

  const onToggleStart = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const handleToggleCell = (i: number, j: number) => () => {
    toggleCell(i, j);
  };

  const onClear = () => {
    setHistory([]);
    setGeneration(0);
    setGrid(generateEmptyGrid(DEFAULT_GRID_SIZE));
  };

  const onRandom = () => {
    setHistory([]);
    setGrid((grid) => {
      const newGrid = grid.map((row) => row.map(() => 0));
      return newGrid.map((row) =>
        row.map(() => {
          return Math.random() > 0.5 ? 1 : 0;
        })
      );
    });
  };

  const onSelectedGeneration = (index: number) => () => {
    setGrid(history[index]);
    setGeneration(index + 1);
  };

  return (
    <div className={"container mx-auto p-4 h-[80vh]"}>
      <div className={"flex flex-col items-center space-y-4 gap-2"}>
        <h1 className={"text-2xl"}>Generation: {generation}</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${DEFAULT_GRID_SIZE}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((_, k) => (
              <div
                key={`${i}-${k}`}
                onClick={handleToggleCell(i, k)}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? "pink" : undefined,
                  border: "solid 1px black",
                }}
              />
            ))
          )}
        </div>
        <div className={"flex space-x-2"}>
          <Button onClick={onRandom}>Random</Button>
          <Button onClick={onClear}>Clear</Button>
          <Button onClick={onToggleStart}>{running ? "Stop" : "Start"}</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>History</Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[425px]"}>
              <DialogHeader>
                <DialogTitle>Generation History</DialogTitle>
              </DialogHeader>
              <ScrollArea
                className={"h-[200px] w-full rounded-md border p-4"}
                style={{ height: "400px" }}
              >
                {history.map((gen: any, index: number) => (
                  <Button
                    key={index}
                    className={"w-full justify-start"}
                    onClick={onSelectedGeneration(index)}
                  >
                    Generation {index + 1}
                  </Button>
                ))}
                {history.length === 0 && (
                  <p className={"text-center"}>No generations to show</p>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
