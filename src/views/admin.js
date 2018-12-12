import React, { Component } from 'react';
import { scrapeWiki } from '../api';

class Admin extends Component {

  constructor() {
    super();
    this.state = {
      disablescrape: false,
      scrapebuttontext: 'Scrape Wiki'
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  scrape = () => {
    this.setState({
      term: '',
      disablescrape: true,
      scrapebuttontext: "Please wait..."
    })
    scrapeWiki(this.state.term)
      .then(r => {
        this.setState({
          disablescrape: false,
          scrapebuttontext: "Scrape Wiki"
        })
      })
  }

  render() {
    return (
      <div className="admin">
        <input
          onChange={this.handleChange}
          name="term"
          value={this.state.term}
        />
        <button
          onClick={this.scrape}
          disabled={this.state.disablescrape}
        >{this.state.scrapebuttontext}</button>
        <p>Note: The scrape wiki operation takes a while;
          sometimes over a minute.</p>
      </div>
    )
  }
}

export default Admin;
