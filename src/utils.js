function makeSorters(columnKeys, c, d, alpha) {
  if (alpha) {
    return (a, b) => {
      const au = a[columnKeys[c]].toUpperCase();
      const bu = b[columnKeys[c]].toUpperCase();

      // eslint-disable-next-line no-nested-ternary
      const decision = au < bu ? -1 : bu < au ? 1 : 0;

      return d === 'd' ? decision : -decision;
    };
  }

  return (a, b) => (d === 'd' ? b[columnKeys[c]] - a[columnKeys[c]]
    : a[columnKeys[c]] - b[columnKeys[c]]);
}

const colSort = function colSort(ck, column, sorting, si, data, di, dn, alpha = false) {
  if (sorting[column] === '⇵') {
    return {
      sorting: sorting.map((e, i) => (i === column ? '↓' : '⇵')),
      [dn]: data.sort(makeSorters(ck, column, 'd', alpha)),
    };
  }

  if (sorting[column] === '↓') {
    return {
      sorting: sorting.map((e, i) => (i === column ? '↑' : '⇵')),
      [dn]: data.sort(makeSorters(ck, column, 'a', alpha)),
    };
  }

  return {
    sorting: si,
    [dn]: di,
  };
};

export default colSort;
