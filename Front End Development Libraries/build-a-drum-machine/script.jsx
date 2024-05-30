import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";


const soundSource = {
  'Q': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
    name: 'Heater 1',
  },
  'W': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
    name: 'Heater 2',
  },
  'E': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
    name: 'Heater 3',
  },
  'A': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
    name: 'Heater 4',
  },
  'S': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
    name: 'Clap',
  },
  'D': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
    name: 'Open-HH',
  },
  'Z': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
    name: "Kick-n'-Hat",
  },
  'X': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
    name: 'Kick',
  },
  'C': {
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
    name: 'Closed-HH',
  },
};



class DrumMachine extends React.Component {
  constructor() {
    super()
    this.state = { currentlyPlaying: '' };
    this.setCurrentlyPlaying = this.setCurrentlyPlaying.bind(this);
  }

  setCurrentlyPlaying(sampleName) {
    this.setState({ currentlyPlaying: sampleName });
  }

  render() {
    const keys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
    const drumPads = keys.map((k) => { return (
      <DrumPad
        keyPress={k}
        setCurrentlyPlaying={ this.setCurrentlyPlaying }
      />
    );})

    return (
      <div id="drum-machine">
        <div id="pad-container">
          {drumPads}
        </div>
        <p id="display">{this.state.currentlyPlaying}</p>
      </div>
    );
  }
}


class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.playAudio = this.playAudio.bind(this);
  }

  componentDidMount() {
    const padButton = document.getElementById(`pad-${this.props.keyPress}`);
    padButton.addEventListener('click', this.playAudio);

    document.addEventListener('keydown', (event) => {
      if (event.key.toUpperCase() === this.props.keyPress) {
        this.playAudio(event);
      }
    });
  }

  playAudio(event) {
    const audioTarget = document.getElementById(this.props.keyPress);
    audioTarget.play();
    this.props.setCurrentlyPlaying(audioTarget.innerText);
  }

  render() {
    const {src, name} = soundSource[this.props.keyPress];

    return (
      <button
        id={`pad-${this.props.keyPress}`}
        className="drum-pad"
       >
        {this.props.keyPress}
        <audio
          id={this.props.keyPress}
          src={src}
          className="clip"
        >
          {name}
        </audio>
      </button>
    )
  }
}

// render
ReactDOM.render(<DrumMachine />, document.getElementById('root'));
