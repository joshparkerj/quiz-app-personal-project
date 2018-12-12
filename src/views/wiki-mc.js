import React, { Component } from 'react';
import Option from './option';

class WikiMC extends Component {

  optionMapper = (e, i) => {
    return (
      <Option
        hc={this.props.hc}
        key={i}
        text={e}
      />
    )
  }

  render() {
    return (
      <div className="wiki-mc">
        <img
          className="image-from-wiki"
          src={this.props.imgUrl || '/no_image.png'}
          alt="hope this helps!"
          onError={i => i.target.src = '/no_image.png'}
        />
        {this.props.wikiText}
        {this.props.wikiAnswers.map(this.optionMapper)}
      </div>
    )
  }

}

export default WikiMC;
