SELECT saltedhashedpassword
FROM userdata
WHERE username = $1;
