// Description: Constants for the game.

export const DEFAULT_GRID_SIZE = 40;

/*
Visual representation of the grid:

X | X | X |
X | O | X |  => The circle is the cell that we are checking
X | X | X |     and the Xs are the cells around it that we are checking

 */
export const AROUND_CELLS = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];
