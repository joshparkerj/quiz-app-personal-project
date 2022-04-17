module.exports = function massive() {
  return new Promise((resolve) => {
    resolve({
      get_all_time_stats: () => new Promise((r) => { r(); }),
    });
  });
};
