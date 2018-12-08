SELECT category FROM question
WHERE type = 'wiki'
AND category != 'Fictional_lesbians'
GROUP BY category
HAVING COUNT(*) > 13
ORDER BY category;
