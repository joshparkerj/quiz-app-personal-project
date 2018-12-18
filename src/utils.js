function makeSorters(columnKeys, c, d, alpha) {
  if (alpha) {
    return (a, b) => {
      const au = a[columnKeys[c]].toUpperCase();
      const bu = b[columnKeys[c]].toUpperCase();
      let decision = au < bu ? -1 : bu < au ? 1 : 0;
      return d === 'd' ? decision : -decision;
    }
  }
  return (a, b) => {
    return d === 'd' ? b[columnKeys[c]] - a[columnKeys[c]] :
      a[columnKeys[c]] - b[columnKeys[c]];
  }
}

export function colSort(ck, column, sorting, si, data, di, dn, alpha = false) {
  if (sorting[column] === '⇵') {
    return {
      sorting: sorting.map((e, i) => i === column ? '↓' : '⇵'),
      [dn]: data.sort(makeSorters(ck, column, 'd', alpha))
    };
  } else if (sorting[column] === '↓') {
    return {
      sorting: sorting.map((e, i) => i === column ? '↑' : '⇵'),
      [dn]: data.sort(makeSorters(ck, column, 'a', alpha))
    };
  } else {
    return {
      sorting: si,
      [dn]: di
    };
  }
}
