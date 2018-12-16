SELECT
    (SELECT username FROM userdata WHERE id = $1 GROUP BY username) AS username,
    category,
    SUM(CASE WHEN correctly_answered > 0 THEN 1 ELSE 0 END) AS correctly_answered,
    COUNT(*) AS questions_total,
    ROUND(
        100 *
        SUM(CASE WHEN correctly_answered > 0 THEN 1 ELSE 0 END)::numeric /
        COUNT(*)::numeric
        ,1
    ) AS percent_correctly_answered
FROM (
    SELECT
        answer,
        category,
        SUM(CASE WHEN answered THEN 1 ELSE 0 END) AS correctly_answered
    FROM question
    LEFT JOIN (
        SELECT question_id,answered FROM userdata
        JOIN asks ON userdata.id = asks.user_id
        WHERE userdata.id = $1
    ) AS user_asks ON question.id = user_asks.question_id
    WHERE category IN (
        SELECT category FROM question
        WHERE type = 'wiki'
        AND category != 'Fictional_lesbians'
        GROUP BY category
        HAVING COUNT(*) > 13
    )
    GROUP BY answer, category
    ORDER BY category
) AS answers
GROUP BY username, category
ORDER BY percent_correctly_answered DESC;
