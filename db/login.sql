SELECT id,profile_pic,username,privilege_level
FROM userdata
WHERE username = $1;
