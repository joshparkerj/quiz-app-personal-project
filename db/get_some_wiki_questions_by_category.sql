SELECT id,text,answer,category,img_url FROM question
WHERE type = 'wiki'
AND category = $1
ORDER BY RANDOM()
LIMIT $2;
