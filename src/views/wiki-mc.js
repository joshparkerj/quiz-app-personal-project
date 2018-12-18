import React, { Component } from 'react';
import Option from './option';
import './wiki-mc.css';

class WikiMC extends Component {

  optionMapper = (e, i) => {
    return (
      <Option
        hc={this.props.hc}
        key={i}
        text={e}
        num={i}
      />
    )
  }

  render() {
    return (
      <div className="wiki-mc">
        {this.props.imgUrl && this.props.imgUrl !== 'https://undefined' ? (
          <img
            className="image-from-wiki"
            src={this.props.imgUrl}
            alt="hope this helps!"
            onError={i => i.target.style.display = 'none'}
          />
        ) : ''}
        <p>{this.props.wikiText}</p>
        <div className="options">
          {this.props.wikiAnswers.map(this.optionMapper)}
        </div>
      </div>
    )
  }

}

export default WikiMC;
