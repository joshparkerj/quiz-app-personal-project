SELECT * FROM question
WHERE type = 'wiki'
AND id = $1
AND answer = $2;
