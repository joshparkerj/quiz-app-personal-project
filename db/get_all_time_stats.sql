SELECT
    category,
    COUNT(*) AS attempts,
    SUM(CASE WHEN answered THEN 1 ELSE 0 END) AS right,
    ROUND(
        100 *
		SUM(CASE WHEN answered THEN 1 ELSE 0 END)::numeric /
        COUNT(*)::numeric
        ,1
    ) AS percent
FROM question
JOIN asks ON question.id = asks.question_id
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;
