SELECT * FROM question
WHERE type = 'mc'
AND id = $1
AND answer = $2;
