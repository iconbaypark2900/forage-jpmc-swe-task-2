import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 * - data: Array of ServerRespond objects to provide the data for the Perspective viewer.
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Extends HTMLElement to include the load method specific to PerspectiveViewer.
 */
interface PerspectiveViewerElement extends HTMLElement{
  load: (table: Table) => void,
}

/**
 * Graph component uses Perspective to visualize data received from its parent.
 * It creates a Perspective viewer element and updates it with new data when received.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table instance
  table: Table | undefined;

  render() {
    // Render a Perspective viewer element. Actual configuration and data loading
    // are done in componentDidMount and componentDidUpdate.
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // This method is called after the component output has been rendered to the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // Define the schema for the Perspective table based on the expected data shape.
    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    // Initialize the Perspective worker and table if available.
    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table && elem) {
      // Load the Perspective table into the viewer element.
      elem.load(this.table);

      // Configure the Perspective viewer attributes.
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: "distinct count",
        top_ask_price: "avg",
        top_bid_price: "avg",
        timestamp: "distinct count"
      }));
    }
  }

  componentDidUpdate() {
    // Called whenever the component's props or state changes.
    // Updates the Perspective table with new data.
    if (this.table) {
      this.table.update(this.props.data.map((el: any) => {
        // Transform the data to match the Perspective schema.
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
