import { range, sum } from './Util'

export enum Piece {
  Black = -1,
  Empty = 0,
  White = 1,
}

export type Board = Piece [][];

export function initBoard(): Board {
  const board = new Array(8).fill(false).map(() => new Array(8).fill(Piece.Empty));
  for (let i = 1; i < 7; i++) {
    board[0][i] = board[7][i] = Piece.Black;
    board[i][0] = board[i][7] = Piece.White;
  }
  return board;
}

export function calculatePossibleMoves(board: Board, row: number, column: number): boolean [][] {
  const selected = board[row][column];
  const pieces = board.map(row => row.map(x => Math.abs(x)));
  const rowSum = sum(pieces[row]);
  const colSum = sum(range(8).map(i => pieces[i][column]));
  const d = row - column;
  const diagSum = sum(d < 0 ? range(8 + d).map(i => pieces[i][i - d]) : range(8 - d).map(j => pieces[j + d][j]));
  const s = row + column;
  const subDiagSum = sum((s < 8 ? range(s + 1) : range(15 - s, s - 7)).map(i => pieces[i][s - i]));
  const moves = range(8).map(_ => new Array(8).fill(false));
  const unobstructed = (a: number []) => !a.some(x => x === -selected);
  if (column >= rowSum && unobstructed(range(rowSum).map(j => board[row][column - j])) && board[row][column - rowSum] != selected)
    moves[row][column - rowSum] = true;
  if (column + rowSum < 8 && unobstructed(range(rowSum).map(j => board[row][column + j])) && board[row][column + rowSum] != selected)
    moves[row][column + rowSum] = true;
  if (row >= colSum && unobstructed(range(colSum).map(i => board[row - i][column])) && board[row - colSum][column] != selected)
    moves[row - colSum][column] = true;
  if (row + colSum < 8 && unobstructed(range(colSum).map(i => board[row + i][column])) && board[row + colSum][column] != selected)
    moves[row + colSum][column] = true;
  if (row >= diagSum && column >= diagSum && unobstructed(range(diagSum).map(i => board[row - i][column - i])) && board[row - diagSum][column - diagSum] != selected)
    moves[row - diagSum][column - diagSum] = true;
  if (row + diagSum < 8 && column + diagSum < 8 && unobstructed(range(diagSum).map(i => board[row + i][column + i])) && board[row + diagSum][column + diagSum] != selected)
    moves[row + diagSum][column + diagSum] = true;
  if (row >= subDiagSum && column + subDiagSum < 8 && unobstructed(range(subDiagSum).map(i => board[row - i][column + i])) && board[row - subDiagSum][column + subDiagSum] != selected)
    moves[row - subDiagSum][column + subDiagSum] = true;
  if (row + subDiagSum < 8 && column >= subDiagSum && unobstructed(range(subDiagSum).map(i => board[row + i][column - i])) && board[row + subDiagSum][column - subDiagSum] != selected)
    moves[row + subDiagSum][column - subDiagSum] = true;
  return moves;
}

function floodfill(grid: boolean [][]): boolean {
  let j = -1;
  const i = grid.findIndex(a => {
    const x = a.indexOf(true);
    if (x >= 0) {
      j = x;
    }
    return x >= 0;
  });
  const q: [number, number] [] = [ [i, j] ];
  while (q.length) {
    const [i, j] = q.pop()!;
    grid[i][j] = false;
    for (let di = -1; di <= 1; di++)
      for (let dj = -1; dj <= 1; dj++)
        if (i + di >= 0 && i + di < 8 && j + dj >= 0 && j + dj < 8 && grid[i + di][j + dj])
          q.push([i + di, j + dj]);
  }
  return !grid.some(a => a.some(x => x));
}

export function checkWinner(board: Piece [][]): Piece | null |  'draw' {
  const white = floodfill(board.map(a => a.map(x => x == Piece.White)));
  const black = floodfill(board.map(a => a.map(x => x == Piece.Black)));
  if (white && black) return 'draw';
  else if (white) return Piece.White;
  else if (black) return Piece.Black;
  else return null;
}
