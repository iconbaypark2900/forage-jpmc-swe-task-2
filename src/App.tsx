import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * Interface for the component state
 * - data: Array of ServerRespond objects to hold data from the server.
 * - showGraph: Boolean to control the visibility of the Graph component.
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * App component serves as the parent element of the React application.
 * It is responsible for fetching data from the server, managing application state,
 * and rendering the Graph component conditionally based on state.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    // Initial state setup
    this.state = {
      data: [], // Initializes as an empty array, to be filled with server data.
      showGraph: false, // Initially, do not show the graph until data is fetched.
    };
  }

  /**
   * Renders the Graph component if showGraph state is true.
   * Passes the current state data to the Graph component as props.
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>);
    }
  }

  /**
   * Fetches new data from the server at regular intervals and updates the component's state.
   * Sets up an interval to call DataStreamer.getData() every 100ms, updates state with new data,
   * and ensures the graph is shown by setting showGraph to true.
   * Stops fetching data after 1000 iterations to prevent unnecessary network requests.
   */
  getDataFromServer() {
    let x = 0; // Counter to track the number of data fetches.
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update state with new data and set showGraph to true to display the graph.
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });
      x++;
      if (x > 1000) { // After 1000 fetches, stop the interval to prevent infinite fetching.
        clearInterval(interval);
      }
    }, 100); // Fetch data every 100 milliseconds.
  }

  /**
   * Renders the component UI.
   * Includes a button to start data streaming and a container for the Graph component.
   * The Graph component is conditionally rendered based on the showGraph state.
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

