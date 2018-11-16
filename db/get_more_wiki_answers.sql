SELECT answer FROM question
WHERE type = 'wiki'
AND id != $1
AND category = $2
ORDER BY RANDOM()
LIMIT $3;
