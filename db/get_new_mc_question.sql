SELECT id,text FROM question
WHERE type = 'mc'
AND id NOT IN (
  SELECT question_id FROM asks
  WHERE user_id = $1
) LIMIT 1;
