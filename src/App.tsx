import React, { useState } from 'react';
import { Piece, initBoard, calculatePossibleMoves, checkWinner } from './Board';
import { range } from './Util';
import './styles.css';

const Game = () => {
  const [board, setBoard] = useState(initBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [player, setPlayer] = useState(Piece.Black);

  const Cell = ({row, column}: {row: number, column: number}) => {
    let piece = '';
    if (board[row][column] === Piece.White) {
      piece = 'O';
    } else if (board[row][column] === Piece.Black) {
      piece = 'X';
    }
    const movable = moves ? moves[row][column] : false;
    const classes = movable ? "cell highlight" : "cell";
    function handleClick() {
      if (winner) return;
      if (board[row][column] === player) setSelected([row, column]);
      else if (selected && movable) {
        const nextBoard = board.map(a => a.slice());
        const [i, j] = selected;
        nextBoard[row][column] = board[i][j];
        nextBoard[i][j] = Piece.Empty;
        setBoard(nextBoard);
        setPlayer(-player);
        setSelected(null);
      }
    }
    return (
      <div onClick={handleClick} className={classes}>
        {piece}
      </div>
    );
  }
  const Row = ({row}: {row: number}) => {
    return (
      <div className="row">
        { range(8).map(i => <Cell row={row} column={i} />) }
      </div>
    );
  }

  const moves = selected ? calculatePossibleMoves(board, ...selected) : null;
  const playerText = player === Piece.White ? 'O' : 'X';
  const winner = checkWinner(board);
  let textWin = '';
  if (winner === Piece.White) textWin = 'O wins!';
  else if (winner === Piece.Black) textWin = 'X wins!';
  else if (winner === 'draw') textWin = 'draw';
  return (
    <div>
      <div className="board">
        { range(8).map(i => <Row row={i} />) }
      </div>
      <div className="game-info">
        <div className="status">Current player: {playerText}</div>
        { winner && (<div className="status">{textWin}</div>) }
      </div>
    </div>
  );
}

export default Game;
