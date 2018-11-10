SELECT id,profile_pic,username,privilege_level
FROM userdata
WHERE id = $1;
