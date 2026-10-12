--GET ALL USERS
SELECT
id, name, email, description, created_at, updated_at
from users;


--CREATE USER
INSERT INTO users (name, email, description)
      VALUES ($1, $2, $3)
      RETURNING *;

--GET USER BY ID
SELECT
id, name, email, description, created_at, updated_at
FROM users
WHERE users.id = $1;
