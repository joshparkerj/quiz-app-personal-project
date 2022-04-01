import React from 'react';
import PropTypes from 'prop-types';

const StatsButton = function StatsButton({
  column, columnSort, sorting, alpha,
}) {
  return (
    <button
      type="button"
      onClick={() => columnSort(column, alpha)}
    >
      { sorting[column] }
    </button>
  );
};

StatsButton.propTypes = {
  column: PropTypes.number.isRequired,
  columnSort: PropTypes.func.isRequired,
  sorting: PropTypes.arrayOf(PropTypes.string).isRequired,
  alpha: PropTypes.bool,
};

StatsButton.defaultProps = {
  alpha: undefined,
};

export default StatsButton;
