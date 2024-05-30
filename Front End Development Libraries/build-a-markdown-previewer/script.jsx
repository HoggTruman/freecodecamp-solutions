import * as React from "https://esm.sh/react";
import * as ReactDOM from "https://esm.sh/react-dom";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";


const defaultText =
      "# header (H1 size) \n\r" +
      "## a sub header (H2 size) \n\r" +
      "[a link](https://www.freecodecamp.org/) \n\r" +
      "`inline code` \n\r" +
      "    a code block \n\r" +
      "- a\n\r - list\n\r - item \n\r" +
      "> a blockquote \n\r" +
      "![an image](https://mdg.imgix.net/assets/images/tux.png?auto=format&fit=clip&q=40&w=100) \n\r" +
      "**bolded text**";

/*
REACT
*/
class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.editorTextChanged = this.editorTextChanged.bind(this);
  }

  editorTextChanged(event) {
    this.props.updateEditorText(event.target.value);
  }

  render() {
    return (
      <div>
        <h3 className="tag">Editor</h3>
        <textarea
          id="editor"
          onChange={ this.editorTextChanged }
          value={ this.props.editorText }
        >
        </textarea>
      </div>
    );
  }
}


class Previewer extends React.Component {
  constructor(props) {
    super(props);
  }

  // dangerouslySetInnerHTML had to be used to pass course tests, should be avoided
  render() {
    return (
      <div>
        <h3 className="tag">Preview</h3>
        <div
          id="preview"
          dangerouslySetInnerHTML={{ __html: marked(this.props.editorText)}}
        >
        </div>
      </div>
    );
  }
}


class App extends React.Component {
  constructor() {
    super();
    this.state = { editorText: defaultText };
    this.updateEditorText = this.updateEditorText.bind(this);
    }

  updateEditorText(text) {
    this.setState({ editorText: text })
  }

  render() {
    return (
      <div>
        <Editor
          editorText={this.state.editorText}
          updateEditorText={this.updateEditorText}
        />
        <Previewer editorText={this.state.editorText}/>
      </div>
    );
  }
}

// render (apparently deprecated in React 18)
ReactDOM.render(<App />, document.getElementById('root'));
