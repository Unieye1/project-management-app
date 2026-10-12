--GET projects by user ID
 SELECT *
       FROM projects
       WHERE owner_id = $1;