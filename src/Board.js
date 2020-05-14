import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';
import shortid from "shortid";
import winnableGrid from './winnable-grid.js'

class Board extends Component {

  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.5 //default 0.5: each cell has a 0.5 chance of being lit initially
  }

  constructor(props) {
    super(props);
    //set initial state
    this.state ={
      hasWon: false, //boolean, true when board is fully off (unlit)
      board: this.createBoard(this.props.nRows, 
                              this.props.nCols, 
                              this.props.chanceLightStartsOn) //2D array, lit: true, unlit: false
    };
    this.flipCellsAroundMe = this.flipCellsAroundMe.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit 
        - nRows: Integer number of rows the board will have
        - nCols: Integer number of columns the board will have
        - chanceLightStartsOn: Float number representing chance that any one cell is set as lit
  */

  createBoard(nRows, nCols, chanceLightStartsOn) {
    let board = [];
    let rand = 0;
    while(board.length < nRows){
      let row = [];
      for(let i = 0; i < nCols; i++ ){
        rand = Math.random();
        row.push(rand < chanceLightStartsOn ? true : false);
      }
      board.push(row);
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */


  flipCell(y, x) {
    // if this coord is actually on board, flip it
    let {nCols, nRows} = this.props;
    let updatedBoard = this.state.board;
    if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
      updatedBoard[y][x] = !updatedBoard[y][x];
      this.setState(curState => ({
        board: curState.board = updatedBoard
      }));
  }
}

  flipCellsAroundMe(y, x) {
    //[selected cell, cell above, cell below, cell on the left, cell on the right]
    let cells = [[y, x],[y-1, x], [y+1, x], [y, x-1], [y, x+1]];
    //for each cell, run flip cell
    cells.forEach(cell => this.flipCell(cell[0], cell[1]));

    if(this.state.board.every(row => !row.includes(true))){
      this.setState({
        hasWon: true
      })
      console.log("Winner!")
    }
    // TODO: determine is the game has been won

    // this.setState({board, hasWon});
  }

  handleReset() {
    this.setState(curState => ({
      board:  curState.board = this.createBoard(this.props.nRows, 
                               this.props.nCols, 
                               this.props.chanceLightStartsOn),
      hasWon: curState.hasWon = false
    }));
  }


  /** Render game board or winning message. */

  render() {

      const gameBoard = this.state.board.map((row, yIndex) => 
                                              <tr key={shortid.generate()}>{row.map((cell, xIndex) => 
                                                            <Cell 
                                                              key={shortid.generate()}
                                                              isLit={cell}
                                                              yIndex={yIndex}
                                                              xIndex={xIndex}
                                                              flipCellsAroundMe={this.flipCellsAroundMe}
                                                            />)}
                                              </tr>);
      return (
        <div className="Board-container">
          { this.state.hasWon ? 
            (<div className='Board-win'>
              <span className='lights'>You</span>
              <span className='out'>Win!</span>
            </div>)
            :
            <div>
              <div className='Board-header'>
                <span className='lights'>Lights</span>
                <span className='out'>Out</span>
              </div>
              <div className='Board-gameboard'>
                <table className='Board-table'>
                  <tbody>
                  {gameBoard}
                  </tbody>
                </table>
              </div> 
            </div>
          }
          <div className="Board-actions">
            <span className='lights instructions'>Instructions</span>
            <span onClick={this.handleReset} className='out new-grid'>New Grid</span>
          </div>
        </div>
      )
  }
}


export default Board;
