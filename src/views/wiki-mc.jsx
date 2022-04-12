import React from 'react';
import PropTypes from 'prop-types';

import Option from './option';
import './wiki-mc.css';

const WikiMC = function WikiMC({
  hc, imgUrl, wikiText, wikiAnswers,
}) {
  const optionMapper = (e, i) => (
    <Option
      hc={hc}
      key={i}
      text={e}
      num={i}
    />
  );

  return (
    <div className="wiki-mc">
      {imgUrl && imgUrl !== 'https://undefined' ? (
        <img
          className="image-from-wiki"
          src={imgUrl}
          alt="hope this helps!"
          // eslint-disable-next-line no-param-reassign
          onError={({ target }) => { target.style.display = 'none'; }}
        />
      ) : ''}
      <p>{wikiText}</p>
      <div className="options">
        {wikiAnswers.map(optionMapper)}
      </div>
    </div>
  );
};

WikiMC.propTypes = {
  hc: PropTypes.func.isRequired,
  imgUrl: PropTypes.string.isRequired,
  wikiText: PropTypes.string.isRequired,
  wikiAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default WikiMC;
