SELECT
    userdata.id,
    userdata.username,
    COUNT(*)
FROM userdata
JOIN asks ON asks.user_id = userdata.id
WHERE userdata.id != $1
GROUP BY userdata.id, username;
