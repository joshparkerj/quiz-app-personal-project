import React from 'react';
import PropTypes from 'prop-types';

import './option.css';

const Option = function Option({ num, hc, text }) {
  return (
    <button
      type="button"
      className={`option${num}`}
      onClick={() => hc(text)}
    >
      {text}
    </button>
  );
};

Option.propTypes = {
  num: PropTypes.number.isRequired,
  hc: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default Option;
