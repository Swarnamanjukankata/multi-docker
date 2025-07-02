import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const res = await axios.get('/api/values/current');
      this.setState({ values: res.data });
    } catch (err) {
      console.error('❌ Failed to fetch current values', err);
    }
  }

  async fetchIndexes() {
    try {
      const res = await axios.get('/api/values/all');
      this.setState({ seenIndexes: res.data });
    } catch (err) {
      console.error('❌ Failed to fetch seen indexes', err);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = this.state.index.trim();

    if (!trimmed || isNaN(trimmed) || parseInt(trimmed, 10) < 0) {
      alert('Please enter a valid non‑negative number');
      return;
    }

    try {
      await axios.post('/api/values', {
        index: parseInt(trimmed, 10),
      });
      this.setState({ index: '' });
      this.fetchIndexes();
    } catch (err) {
      console.error('❌ Failed to submit index', err);
    }
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key}, I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    const { index } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={index}
            onChange={(e) => this.setState({ index: e.target.value })}
            placeholder="e.g. 5"
          />
          <button disabled={!index.trim()}>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
