import { useCallback, useEffect, useRef, useState } from "react";
import {
  AROUND_CELLS,
  DEFAULT_GRID_SIZE,
  MOBILE_GRID_SIZE,
  SPEEDS,
} from "../../../lib/constants/game";
import useGrid from "../Hooks/useGrid";
import useIsMobile from "../Hooks/useIsMobile";

import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { Slider } from "../../ui/slider";

type SpeedLevel = 1 | 2 | 3;
type Grid = number[][];

const nextGeneration = (grid: Grid): Grid => {
  const size = grid.length;
  const newGrid = grid.map((row) => [...row]);

  for (let i = 0; i < size; i++) {
    for (let k = 0; k < size; k++) {
      let neighbors = 0;
      for (const [x, y] of AROUND_CELLS) {
        const newI = i + x;
        const newK = k + y;
        if (newI >= 0 && newI < size && newK >= 0 && newK < size) {
          neighbors += grid[newI][newK];
        }
      }

      if (neighbors < 2 || neighbors > 3) {
        newGrid[i][k] = 0;
      } else if (grid[i][k] === 0 && neighbors === 3) {
        newGrid[i][k] = 1;
      }
    }
  }

  return newGrid;
};

const isEmptyGrid = (grid: Grid) =>
  grid.length === 0 || grid.every((row) => row.every((cell) => cell === 0));

const parseSpeed = (value: number[]): SpeedLevel | null => {
  const next = value[0];
  if (next === 1 || next === 2 || next === 3) {
    return next;
  }
  return null;
};

const GameContainer = () => {
  const isMobile = useIsMobile();
  const gridSize = isMobile ? MOBILE_GRID_SIZE : DEFAULT_GRID_SIZE;

  const { grid, setGrid, toggleCell, generateEmptyGrid } = useGrid(gridSize);

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [history, setHistory] = useState<Grid[]>([]);
  const [speed, setSpeed] = useState<SpeedLevel>(3);

  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  const gridRef = useRef(grid);
  const timeoutRef = useRef<number | null>(null);

  runningRef.current = running;
  speedRef.current = speed;
  gridRef.current = grid;

  const clearTick = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    const current = gridRef.current;
    if (isEmptyGrid(current)) {
      runningRef.current = false;
      setRunning(false);
      return;
    }

    const newGrid = nextGeneration(current);
    gridRef.current = newGrid;
    setGrid(newGrid);
    setHistory((previous) => [...previous, newGrid]);
    setGeneration((value) => value + 1);
    timeoutRef.current = window.setTimeout(
      runSimulation,
      SPEEDS[speedRef.current] ?? SPEEDS[3]
    );
  }, [setGrid]);

  const onToggleStart = () => {
    if (running) {
      runningRef.current = false;
      setRunning(false);
      clearTick();
      return;
    }

    runningRef.current = true;
    setRunning(true);
    runSimulation();
  };

  const handleToggleCell = (i: number, j: number) => () => {
    if (runningRef.current) {
      return;
    }
    toggleCell(i, j);
  };

  const onClear = () => {
    runningRef.current = false;
    setRunning(false);
    clearTick();
    setHistory([]);
    setGeneration(0);
    setGrid(generateEmptyGrid(gridSize));
  };

  const onRandom = () => {
    setHistory([]);
    setGeneration(0);
    setGrid((current) =>
      current.map((row) => row.map(() => (Math.random() > 0.5 ? 1 : 0)))
    );
  };

  const onSelectedGeneration = (index: number) => () => {
    const snapshot = history[index];
    if (!snapshot) {
      return;
    }
    runningRef.current = false;
    setRunning(false);
    clearTick();
    setGrid(snapshot);
    setGeneration(index + 1);
  };

  const isFirstGridSync = useRef(true);

  useEffect(() => {
    if (isFirstGridSync.current) {
      isFirstGridSync.current = false;
      return;
    }

    runningRef.current = false;
    setRunning(false);
    clearTick();
    setHistory([]);
    setGeneration(0);
    const empty = generateEmptyGrid(gridSize);
    gridRef.current = empty;
    setGrid(empty);
  }, [gridSize, setGrid]);

  useEffect(() => {
    return () => {
      clearTick();
    };
  }, []);

  const handleChangeSpeed = (value: number[]) => {
    const next = parseSpeed(value);
    if (next === null) {
      return;
    }
    setSpeed(next);
  };

  return (
    <div className="relative z-10 mx-auto max-w-page px-[15px] pb-[32px] pt-[19px] md:px-[30px] md:pb-[46px] md:pt-[19px]">
      <div className="flex min-w-0 flex-col gap-[19px] md:gap-[30px]">
        <p
          className="text-caption uppercase text-ink"
          style={{ letterSpacing: "0.05em" }}
        >
          Simulación
        </p>
        <p className="max-w-lg text-left text-[18px] leading-[1.4] tracking-[0.23px] text-ink">
          Clic en una celda para dibujar. History guarda cada generación para
          volver atrás.
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-x-[19px] gap-y-[15px]">
          <p
            className="shrink-0 text-caption uppercase text-ink"
            style={{ letterSpacing: "0.05em" }}
          >
            Generation {generation}
          </p>
          <div className="flex min-w-0 w-[min(100%,220px)] items-center gap-[15px] md:w-[220px]">
            <label
              htmlFor="speed"
              className="shrink-0 text-caption uppercase text-ink"
              style={{ letterSpacing: "0.05em" }}
            >
              Speed
            </label>
            <Slider
              id="speed"
              max={3}
              min={1}
              step={1}
              value={[speed]}
              onValueChange={handleChangeSpeed}
            />
          </div>
          <div className="flex flex-wrap gap-[15px] md:ml-auto">
            <Button onClick={onRandom}>Random →</Button>
            <Button onClick={onToggleStart} variant="secondary">
              {running ? "Stop →" : "Start →"}
            </Button>
            <Button onClick={onClear} variant="destructive">
              Clear →
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>History →</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-left">
                  <DialogTitle>Generation history</DialogTitle>
                  <DialogDescription className="text-left text-[18px] leading-[1.4] tracking-[0.23px] text-ink">
                    Cada paso de la simulación queda en esta lista. Elige una
                    generación para restaurar ese tablero.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[min(50vh,400px)] w-full rounded-none border border-ash p-[15px] md:p-[30px]">
                  {history.map((_gen, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={onSelectedGeneration(index)}
                    >
                      Generation {index + 1} →
                    </Button>
                  ))}
                  {history.length === 0 && (
                    <p className="text-left text-[18px] leading-[1.4] text-ink">
                      No generations to show
                    </p>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full min-w-0 max-w-[min(100%,calc(100svh-12rem))] rounded-none bg-grid-paper p-[15px] md:p-[30px]">
          <div
            className="grid aspect-square w-full"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((_, k) => (
                <button
                  type="button"
                  key={`${i}-${k}`}
                  aria-label={`Cell ${i},${k}`}
                  onClick={handleToggleCell(i, k)}
                  className={cn(
                    "aspect-square w-full min-h-[18px] touch-manipulation rounded-none border border-ash",
                    grid[i][k] ? "bg-ink" : "bg-paper"
                  )}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
