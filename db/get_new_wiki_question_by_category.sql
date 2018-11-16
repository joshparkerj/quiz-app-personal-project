SELECT id,text,answer,category,img_url FROM question
WHERE type = 'wiki'
AND category = $2
AND id NOT IN (
  SELECT question_id FROM asks
  WHERE user_id = $1
) LIMIT 1;
