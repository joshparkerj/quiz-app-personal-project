WITH left_table AS (
    SELECT question_id FROM asks
    JOIN userdata ON asks.user_id = userdata.id
    WHERE answered AND userdata.id = $1
    GROUP BY question_id
), right_table AS (
    SELECT question_id FROM asks
    JOIN userdata ON asks.user_id = userdata.id
    WHERE answered AND userdata.id = $2
    GROUP BY question_id
), intersection AS (
    (SELECT question_id FROM asks
    JOIN userdata ON asks.user_id = userdata.id
    WHERE answered AND userdata.id = $1
    GROUP BY question_id)INTERSECT(
    SELECT question_id FROM asks
    JOIN userdata ON asks.user_id = userdata.id
    WHERE answered AND userdata.id = $2
    GROUP BY question_id)
)
SELECT ((SELECT COUNT(*)::numeric FROM intersection) /
(SELECT |/COUNT(*)::numeric AS oo_denominator FROM left_table,right_table)
) AS score,
(SELECT username FROM userdata WHERE id = $2) AS username;
