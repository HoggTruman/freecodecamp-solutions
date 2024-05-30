import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import * as redux from "https://esm.sh/redux";
import  * as reactRedux from "https://esm.sh/react-redux";



//// REDUX
// default state
const defaultState = {
  general: {
    sessionLength: 25,
    breakLength: 5,
    currentPeriod: 'session',
  },
  timer : {
    timeLeft: 25 * 60 * 1000,
    paused: true,
    startStopTimer: null,
    resetTimer: null,
  }
}

// actions
const INCREMENTSESSION = 'INCREMENTSESSION';
const DECREMENTSESSION = 'DECREMENTSESSION';
const INCREMENTBREAK = 'INCREMENTBREAK';
const DECREMENTBREAK = 'DECREMENTBREAK';
const SETCURRENTPERIOD = 'SETCURRENTPERIOD';

const SETTIMELEFT = 'SETTIMELEFT';
const SETPAUSED = 'SETPAUSED';
const SETSTARTSTOPTIMER = 'SETSTARTSTOPTIMER';
const SETRESETTIMER = 'SETRESETTIMER';

// action creators
function incrementSession() {
  return {
    type: INCREMENTSESSION,
  };
}

function decrementSession() {
  return {
    type: DECREMENTSESSION,
  };
}

function incrementBreak() {
  return {
    type: INCREMENTBREAK,
  };
}

function decrementBreak() {
  return {
    type: DECREMENTBREAK,
  };
}

function setCurrentPeriod(currentPeriod) {
  return {
    type: SETCURRENTPERIOD,
    currentPeriod: currentPeriod,
  }
}

function setTimeLeft(timeLeft) {
  return {
    type: SETTIMELEFT,
    timeLeft: timeLeft,
  }
}

function setPaused(paused) {
  return {
    type: SETPAUSED,
    paused: paused,
  }
}

function setStartStopTimer(startStopTimer) {
  return {
    type: SETSTARTSTOPTIMER,
    startStopTimer: startStopTimer,
  }
}

function setResetTimer(resetTimer) {
  return {
    type: SETRESETTIMER,
    resetTimer: resetTimer,
  }
}


// reducers
function generalReducer(state=defaultState.general, action) {
  switch(action.type) {
    case INCREMENTSESSION:
      return {
        ...state,
        sessionLength: state.sessionLength + 1,
      };
    case DECREMENTSESSION:
      return {
        ...state,
        sessionLength: state.sessionLength - 1,
      };
    case INCREMENTBREAK:
      return {
        ...state,
        breakLength: state.breakLength + 1,
      };
    case DECREMENTBREAK:
      return {
        ...state,
        breakLength: state.breakLength - 1,
      };
    case SETCURRENTPERIOD:
      return {
        ...state,
        currentPeriod: action.currentPeriod,
      };
    default:
      return state;
  }
}


function timerReducer(state=defaultState.timer, action) {
  switch(action.type) {
    case SETTIMELEFT:
      return {
        ...state,
        timeLeft: action.timeLeft,
      };
    case SETPAUSED:
      return {
        ...state,
        paused: action.paused,
      };
    case SETSTARTSTOPTIMER:
      return {
        ...state,
        startStopTimer: action.startStopTimer,
      }
    case SETRESETTIMER:
      return {
        ...state,
        resetTimer: action.resetTimer,
      }
    default:
      return state;
  }
}


const rootReducer = redux.combineReducers(
  {
    general: generalReducer,
    timer: timerReducer,
  }
)

// create store
const store = redux.createStore(rootReducer);


//// react
class App extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const startStopButton = document.getElementById('start_stop');
    startStopButton.addEventListener('click', () => {
      this.props.timer.startStopTimer()
    })

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
      this.props.timer.resetTimer()
    })
  }

  render() {
    const {sessionLength, breakLength} = this.props.general;
    const {
      incrementSession, decrementSession,
      incrementBreak, decrementBreak,
    } = this.props.generalDispatch;

    return (
      <div id="app">
        <h1> {`${sessionLength} + ${breakLength} Clock`} </h1>
        <div id="durationSettersContainer">
          <DurationSetter
            timePeriod="session"
            length={sessionLength}
            incCallback={incrementSession}
            decCallback={decrementSession}
            resetTimer={this.props.timer.resetTimer}
          />
          <DurationSetter
            timePeriod="break"
            length={breakLength}
            incCallback={incrementBreak}
            decCallback={decrementBreak}
            resetTimer={this.props.timer.resetTimer}
          />
        </div>
        <Timer
          general={this.props.general}
          timer={this.props.timer}
          generalDispatch={this.props.generalDispatch}
          timerDispatch={this.props.timerDispatch}
        />
        <div id="play-reset-buttons">
          <button id="start_stop">
            {this.props.timer.paused? "Start": "Pause"}
          </button>
          <button id="reset">
            Reset
          </button>
        </div>
      </div>

    );
  }
}


class DurationSetter extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // add event listeners
    const decButton = document.getElementById(`${this.props.timePeriod}-decrement`);
    const incButton = document.getElementById(`${this.props.timePeriod}-increment`);

    decButton.addEventListener("click", () => {
      if (this.props.length > 1) {
        this.props.decCallback();
        this.props.resetTimer();
      }
    });

    incButton.addEventListener("click", () => {
      if (this.props.length < 60) {
        this.props.incCallback();
        this.props.resetTimer();
      }
    });
  }

  render() {

    return (
      <div className="durationSetter">
        <h2 id={`${this.props.timePeriod}-label`}>
          {this.props.timePeriod} Length
        </h2>
        <div className="durationSetterButtons">
          <button
            id={`${this.props.timePeriod}-decrement`}
            className="inc-dec-button"
          >-</button>

          <h3 id={`${this.props.timePeriod}-length`}>{this.props.length}</h3>

          <button
            id={`${this.props.timePeriod}-increment`}
            className="inc-dec-button"
          >+</button>
        </div>
      </div>
    )
  }
}


class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.interval = undefined;
    this.endTime = null;
    this.timerBeep = null;

    this.startStopTimer = this.startStopTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  componentDidMount() {
    this.props.timerDispatch.setResetTimer(this.resetTimer);
    this.props.timerDispatch.setStartStopTimer(this.startStopTimer);
    this.timerBeep = document.getElementById('beep');
  }

  calculateDisplayTime(time) {
    // convert the ms remaining time to correct format
    const minutes = Math.floor(Math.ceil(time / 1000) / 60);
    const seconds = `${Math.ceil(time / 1000) % 60}`.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  startStopTimer() {
    if (this.interval) {
      this.stopTimer();
    }
    else {
      this.startTimer();
    }
  }


  startTimer() {
    const startTime = Date.now();
    this.endTime = startTime + this.props.timer.timeLeft;
    this.props.timerDispatch.setPaused(false);

    // update timeLeft every ~10 ms
    this.interval = setInterval(
      () => {
        const timeLeft = this.endTime - Date.now();
        if (timeLeft > 0) {
          this.props.timerDispatch.setTimeLeft(timeLeft);
          console.log(timeLeft)
        }
        else {
          this.interval = clearInterval(this.interval)

          const nextPeriod = this.props.general.currentPeriod == 'session'? 'break': 'session';
          const nextTimerLength = nextPeriod == 'session'?
                this.props.general.sessionLength:
                this.props.general.breakLength;

          this.props.generalDispatch.setCurrentPeriod(nextPeriod);
          this.props.timerDispatch.setTimeLeft(nextTimerLength * 1000 * 60);

          // play beep
          this.timerBeep.play();

          // start next timer
          this.startStopTimer()
        }
      }, 10)
  }

  stopTimer() {
    this.interval = clearInterval(this.interval);
    const timeLeft = this.endTime - Date.now()

    this.props.timerDispatch.setTimeLeft(timeLeft)
    this.props.timerDispatch.setPaused(true);
  }

  resetTimer() {
    if (this.interval) {
      this.interval = clearInterval(this.interval)
    }
    this.props.timerDispatch.setTimeLeft(this.props.general.sessionLength * 1000 * 60);
    this.props.timerDispatch.setPaused(true);
    this.props.generalDispatch.setCurrentPeriod('session');

    // stop audio playing and reset to start
    this.timerBeep.pause();
    this.timerBeep.currentTime = 0;
  }

  render() {
    return (
      <div id="timer">
        <h2 id="timer-label">{this.props.general.currentPeriod}</h2>
        <p id="time-left">
          {this.calculateDisplayTime(this.props.timer.timeLeft)}
        </p>
        <audio
          id='beep'
          src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'>
        </audio>
      </div>
    )
  }
}


// react-redux
const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    generalDispatch: {
      incrementSession: () => {
        dispatch(incrementSession())
      },
      decrementSession: () => {
        dispatch(decrementSession())
      },
      incrementBreak: () => {
        dispatch(incrementBreak())
      },
      decrementBreak: () => {
        dispatch(decrementBreak())
      },
      setCurrentPeriod: (currentPeriod) => {
        dispatch(setCurrentPeriod(currentPeriod))
      },
    },
    timerDispatch: {
      setTimeLeft: (timeLeft) => {
        dispatch(setTimeLeft(timeLeft))
      },
      setPaused: (paused) => {
        dispatch(setPaused(paused))
      },
      setStartStopTimer: (startStopTimer) => {
        dispatch(setStartStopTimer(startStopTimer))
      },
      setResetTimer: (resetTimer) => {
        dispatch(setResetTimer(resetTimer))
      },
    }
  };
}


const Container = reactRedux.connect(mapStateToProps, mapDispatchToProps)(App);
const Provider = reactRedux.Provider;

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    )
  }
}

// render
ReactDOM.render(<AppWrapper />, document.getElementById('root'));
