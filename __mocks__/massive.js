module.exports = function massive() {
  return new Promise((resolve) => {
    resolve({
      get_all_time_stats: () => new Promise((r) => { r(); }),
      post_user: () => new Promise((r) => { r(); }),
      get_some_wiki_questions_by_category: ([cat, count]) => new Promise((r) => {
        const xs = 'x'.repeat(count);
        const spread = [...xs];
        const wikiQuestions = spread.map(() => ({
          id: 1,
          question: 'x',
          answer: 'x',
          category: cat,
          img_url: 'x',
        }));

        r(wikiQuestions);
      }),
      get_more_wiki_answers: ([id, cat, count]) => new Promise((r) => {
        const xs = 'x'.repeat(count);
        const spread = [...xs];
        const wikiAnswers = spread.map(() => ({
          id,
          answer: 'x',
          category: cat,
        }));

        r(wikiAnswers);
      }),
    });
  });
};
