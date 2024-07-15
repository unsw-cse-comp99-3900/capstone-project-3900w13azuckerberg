If there's an error when

```bash
flask db upgrade
```

try this in the psql terminal (replace the version number with yours):

```sql
SELECT * FROM alembic_version;
```

```
 version_num  
--------------
 f2cda0b07d26
```

```sql
DELETE FROM alembic_version 
WHERE version_num = 'f2cda0b07d26';
```
