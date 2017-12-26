import React, { PureComponent } from 'react';
import './App.css';

const MAX_INTERVAL = 1000;
const START_SPEED = 50;

// Color mappings 
const CLEAR = 'transparent';
const CURRENT = 'lightblue';
const GREATER = 'green';
const INDEX = 'yellow';
const LESS = 'red';

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    const arrayA = ['b','a','c','b','a','d','b','a','c','b','a','d'];
    const arrayB = ['a','b','a','z','d','c','a','b','a','z','d','c'];
    const listA = this.parseArray(arrayA);
    const listB = this.parseArray(arrayB);
    const matrix = this.generateMatrix(listA.length, listB.length);
    this.state = {
      x: 0,
      y: 0,
      LCS: '',
      isRunning: false,
      speed: START_SPEED,
      listA, listB, matrix,
    }

    this.handleRun = this.handleRun.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleChangeList = this.handleChangeList.bind(this);
    this.renderInputForm = this.renderInputForm.bind(this);

    this.runAlgorithm = this.runAlgorithm.bind(this);
    this.backTrack = this.backTrack.bind(this);
  }

  parseArray(array) {
    let list = []
    for (let data of array) {
      list.push({
        data,
        backgroundColor: CLEAR,
      });
    }
    return list;
  }

  generateMatrix(a, b) {
    let matrix = [];
    for (let x = 0; x < b; x++) {
      matrix[x] = [];
      for (let y = 0; y < a; y++) {
        matrix[x].push({ data: 0, backgroundColor: CLEAR });
      }
    }
    return matrix;
  }

  backTrack() {
    const { listA, listB, matrix, isRunning } = this.state;
    let { x, y, LCS } = this.state;

    if (!isRunning || x < 0 || y < 0) {
      return this.handleStop();
    }

    matrix[x][y].backgroundColor = CURRENT;
    listB[x].backgroundColor = listA[y].backgroundColor = INDEX;

    let blockA = [x-1,y];
    let blockB = [x,y-1];
    if (listB[x].data === listA[y].data) {
      LCS = listB[x].data + LCS;
      x--;
      y--;
    } else if ((x === 0 ? 0: matrix[x-1][y].data) > (y === 0 ? 0 : matrix[x][y-1].data)) {
      if (x > 0) {
        matrix[x-1][y].backgroundColor = GREATER;
      }
      if (y > 0) {
        matrix[x][y-1].backgroundColor = LESS;
      }
      x--;
    } else {
      if (x > 0) {
        matrix[x-1][y].backgroundColor = LESS;
      }
      if (y > 0) {
        matrix[x][y-1].backgroundColor = GREATER;
      }
      y--;
    }

    let interval = MAX_INTERVAL - (MAX_INTERVAL * (this.state.speed / 100));
    this.setState({ listA, listB, matrix, x, y, LCS },
      () => setTimeout(() => {
        if (blockA[0] > -1 && blockA[1] > -1
          && matrix[blockA[0]][blockA[1]].backgroundColor === LESS) {
            matrix[blockA[0]][blockA[1]].backgroundColor = CLEAR;
        }
        if (blockB[0] > -1 && blockB[1] > -1
          && matrix[blockB[0]][blockB[1]].backgroundColor === LESS) {
            matrix[blockB[0]][blockB[1]].backgroundColor = CLEAR;
        }
        if (x < listB.length-1) {
          listB[x+1].backgroundColor = CLEAR;
        }
        if (y < listA.length-1) {
          listA[y+1].backgroundColor = CLEAR;
        }
        this.setState({ listA, listB, matrix },
          () => this.backTrack());
      }, interval)
    )
  }

  runAlgorithm() {
    const { listA, listB, matrix, isRunning, x, y } = this.state;

    if (!isRunning) {
      return this.handleStop();
    } else if (y === listA.length) {
      if (x === listB.length - 1) {
        this.setState({ y : y-1 }, () => this.backTrack());
      } else {
        this.setState({ x: x+1, y: 0 }, () => this.runAlgorithm());
      }
      return;
    }

    if (listB[x].data === listA[y].data) {
      if (x > 0 && y > 0) {
        matrix[x-1][y-1].backgroundColor = GREATER;
        matrix[x][y].data = matrix[x-1][y-1].data+1;
      } else {
        matrix[x][y].data = 1;
      }
    } else {
      if (x > 0 && y > 0) {
        if (matrix[x-1][y].data === matrix[x][y-1].data) {
          matrix[x-1][y].backgroundColor = matrix[x][y-1].backgroundColor = GREATER;
          matrix[x][y].data = matrix[x-1][y].data;
        } else if (matrix[x-1][y].data > matrix[x][y-1].data) {
          matrix[x-1][y].backgroundColor = GREATER;
          matrix[x][y-1].backgroundColor = LESS;
          matrix[x][y].data = matrix[x-1][y].data;
        } else {
          matrix[x-1][y].backgroundColor = LESS;
          matrix[x][y-1].backgroundColor = GREATER;
          matrix[x][y].data = matrix[x][y-1].data;
        }
      } else if (x > 0) {
        matrix[x-1][y].backgroundColor = GREATER;
        matrix[x][y].data = matrix[x-1][y].data;
      } else if (y > 0) {
        matrix[x][y-1].backgroundColor = GREATER;
        matrix[x][y].data = matrix[x][y-1].data;
      }
    }

    matrix[x][y].backgroundColor = CURRENT;
    listB[x].backgroundColor = listA[y].backgroundColor = INDEX;

    let interval = MAX_INTERVAL - (MAX_INTERVAL * (this.state.speed / 100));
    this.setState({ listA, listB, matrix, y: y+1 },
      () => setTimeout(() => {
        listB[x].backgroundColor = listA[y].backgroundColor = CLEAR;
        if (x > 0 && y > 0) {
          matrix[x-1][y-1].backgroundColor = CLEAR;
        }
        if (x > 0) {
          matrix[x-1][y].backgroundColor = CLEAR;
        }
        if (y > 0) {
          matrix[x][y-1].backgroundColor = CLEAR;
        }
        matrix[x][y].backgroundColor = CLEAR;
        this.setState({ listA, listB, matrix },
          () => this.runAlgorithm());
      }, interval)
    )
  }

  handleRun(event) {
    if (!this.state.isRunning) {
      this.handleClear();
      this.setState({
        matrix: this.generateMatrix(this.state.listA.length, this.state.listB.length),
        isRunning: true,
        x: 0,
        y: 0,
        LCS: '',
      }, () => this.runAlgorithm());
    }
  }

  handleStop(event) {
    if (this.state.isRunning) {
      this.setState({
        isRunning: false,
      });
    }
  }

  handleClear(event) {
    if (!this.state.isRunning) {
      this.setState({
        matrix: this.generateMatrix(this.state.listA.length, this.state.listB.length)
      })
    }
  }

  handleChangeList(event) {
    if (this.state.isRunning) {
      return;
    }
    let array = event.target.value;
    this.setState({
      [event.target.name]: this.parseArray(array),
      matrix: event.target.name === 'listA'
        ? this.generateMatrix(array.length, this.state.listB.length)
        : this.generateMatrix(this.state.listA.length, array.length)
    });
  }

  renderHeader() {
    return (
      <div>
        {
          "Find the longest common subsequence between two strings."
        }
        <p/>
      </div>
    )
  }

  renderInputForm() {
    return (
      <form>
        <label>
          List A
          <textarea
            rows="4"
            cols="50"
            name="listA"
            value={this.state.listA.map((obj) => obj.data).join('')}
            onChange={this.handleChangeList}
            disabled={this.state.isRunning}
          />
        </label>
        <p/>
        <label>
          List B
          <textarea
            rows="4"
            cols="50"
            name="listB"
            value={this.state.listB.map((obj) => obj.data).join('')}
            onChange={this.handleChangeList}
            disabled={this.state.isRunning}
          />
        </label>
        <p/>
        <input type="button" value="run" onClick={this.handleRun} />
        <input type="button" value="stop" onClick={this.handleStop}
          style={{ marginLeft: 25 }}
        />
        <input type="button" value="clear" onClick={this.handleClear}
          style={{ marginLeft: 25 }}
        />
        <p/>
        <div>
          <input
            type="range"
            value={this.state.speed}
            onChange={(event) => this.setState({ speed: event.target.value })}
          />
        </div>
        <p/>
        <label>
          Longest common subsequence
          <textarea
            rows="4"
            cols="50"
            value={this.state.LCS}
            disabled={true}
          />
        </label>
        <p/>
      </form>
    );
  }

  renderNumberBlock(listObj, x, y) {
    return (
      <div
        key={`${x},${y}`}
        className="NumberBlock"
        style={{ backgroundColor: listObj.backgroundColor }}
      >
        { listObj.data }
      </div>
    );
  }

  renderListDisplay(list, x, y, delta) {
    let display = [];
    for (let listObj of list) {
      display.push(this.renderNumberBlock(listObj, x, y));
      x += delta[0];
      y += delta[1];
    }
    return display;
  }

  renderListDisplays() {
    return (
      <div style={{ padding: 20 }}>
        <div
          style={{ display: 'flex' }}
          children={[
            <div key={'0,0'} className="NumberBlock"/>,
            ...this.renderListDisplay(this.state.listA, 1, 0, [1,0])
          ]}
        />
        <div style={{ display: 'flex' }}>
          <div children={this.renderListDisplay(this.state.listB, 0, 1, [0,1])} />
          <div children={this.renderMatrix(this.state.matrix)} />
        </div>
      </div>
    )
  }

  renderMatrix(matrix) {
    let display = [];
    let x = 1;
    let y = 1;
    for (let row of matrix) {
      display.push(
        <div
          key={`matrixRow${y}`}
          style={{ display: 'flex' }}
          children={this.renderListDisplay(row, x, y, [1,0])}
        />
      );
      y += 1;
    }
    return display;
  }

  render() {
    return (
      <div className="App">
        { this.renderHeader() }
        <div style={{ display: 'flex' }}>
          { this.renderInputForm() }
          { this.renderListDisplays() }
        </div>
      </div>
    );
  }
}
