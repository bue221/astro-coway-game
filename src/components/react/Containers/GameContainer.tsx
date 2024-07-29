import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AROUND_CELLS,
  DEFAULT_GRID_SIZE,
  SPEEDS,
} from "../../../lib/constants/game";
import useGrid from "../Hooks/useGrid";
import useIsMobile from "../Hooks/useIsMobile";

import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { Slider } from "../../ui/slider";

const GameContainer = () => {
  const isMobile = useIsMobile();

  const DEFAULT_SIZE_DEVICE = useMemo(() => {
    return isMobile ? 18 : DEFAULT_GRID_SIZE;
  }, [isMobile]);

  const { grid, setGrid, toggleCell, generateEmptyGrid } =
    useGrid(DEFAULT_GRID_SIZE);

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [history, setHistory] = useState<any>([]);
  const [speed, setSpeed] = useState(3);

  const runningRef = useRef(running);
  runningRef.current = running;

  const latestGeneration = useRef<number[][]>([]);

  const runSimulation = useCallback(() => {
    // Stop the simulation if the grid is empty
    if (
      latestGeneration?.current?.length > 0 &&
      latestGeneration?.current?.every((row) => row.every((cell) => cell === 0))
    ) {
      return;
    }

    // Stop the simulation if the user stops it
    if (!runningRef.current) {
      return;
    }

    // Run the simulation
    setGrid((g) => {
      const newGrid = g.map((row) => [...row]);
      for (let i = 0; i < DEFAULT_SIZE_DEVICE; i++) {
        for (let k = 0; k < DEFAULT_SIZE_DEVICE; k++) {
          let neighbors = 0;
          AROUND_CELLS.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;
            if (
              newI >= 0 &&
              newI < DEFAULT_SIZE_DEVICE &&
              newK >= 0 &&
              newK < DEFAULT_SIZE_DEVICE
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
      latestGeneration.current = newGrid;
      return newGrid;
    });

    // Update the generation
    setGeneration((generation) => generation + 1);

    // Run the simulation again
    setTimeout(runSimulation, SPEEDS[speed ?? 1]);
  }, [grid, speed]);

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
    setGrid(generateEmptyGrid(DEFAULT_SIZE_DEVICE));
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

  useEffect(() => {
    setGrid(generateEmptyGrid(DEFAULT_SIZE_DEVICE));
  }, [isMobile]);

  const handleChangeSpeed = (value: any) => {
    setSpeed(value);
  };

  return (
    <div className={"container mx-auto p-4 h-[80vh]"}>
      <div
        className={
          "flex items-center justify-evenly flex-col-reverse md:flex-row p-4 "
        }
      >
        <div
          className="mt-10 md:mt-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${DEFAULT_SIZE_DEVICE}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((_, k) => (
              <div
                key={`${i}-${k}`}
                onClick={handleToggleCell(i, k)}
                className={cn(
                  "cursor-pointer size-[20px] border border-black dark:border-slate-400 rounded-md",
                  grid[i][k] ? "bg-pink-400 dark:bg-purple-600" : grid[i][k]
                )}
              />
            ))
          )}
        </div>
        <div className={"flex flex-col justify-center items-center gap-10"}>
          <h1 className={"text-2xl font-bold italic"}>
            Generation: {generation}
          </h1>
          <div className="w-full">
            <label
              htmlFor="speed"
              className="block text-sm font-medium dark:text-white text-gray-700 mb-3"
            >
              Speed
            </label>
            <Slider
              max={3}
              min={1}
              step={speed}
              onValueChange={handleChangeSpeed}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={onRandom}>Random</Button>
            <Button onClick={onToggleStart} variant="secondary">
              {running ? "Stop" : "Start"}
            </Button>
            <Button onClick={onClear} variant="destructive">
              Clear
            </Button>
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
                      variant="ghost"
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
    </div>
  );
};

export default GameContainer;
