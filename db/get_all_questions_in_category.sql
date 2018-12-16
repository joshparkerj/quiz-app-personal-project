SELECT answer,text,img_url,id FROM question
WHERE category = $1
ORDER BY answer;
