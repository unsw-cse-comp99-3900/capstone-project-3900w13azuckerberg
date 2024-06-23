# Some common `psql` terminal commands:


| Command               | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `\c database_name`    | Connect to a database.                                              |
| `\l` or `\list`       | List all databases.                                                 |
| `\dt`                 | List all tables in the current database.                            |
| `\d table_name`       | Describe a table (show table schema).                               |
| `\dn`                 | List all schemas.                                                   |
| `\df`                 | List all functions.                                                 |
| `\dv`                 | List all views.                                                     |
| `\di`                 | List all indexes.                                                   |
| `\du`                 | List all roles.                                                     |
| `\dp`                 | List all tables, views, and sequences with their access privileges. |
| `\q`                  | Quit`psql`.                                                         |
| `\h` or `\help`       | Get help on SQL commands.                                           |
| `\?`                  | Get help on psql commands.                                          |
| `\!`                  | Execute a shell command.                                            |
| `\timing`             | Toggle timing of commands (how long each command takes to execute). |
| `\x`                  | Toggle expanded output (vertical display of query results).         |
| `\copy`               | Copy data between a file and a table.                               |
| `\i file_name`        | Execute SQL commands from a file.                                   |
| `\echo 'text'`        | Print text to the terminal.                                         |
| `\set variable value` | Set a psql variable to a value.                                     |
| `\unset variable`     | Unset (delete) a psql variable.                                     |
| `\pset`               | Set table output options (like format, border, etc.).               |
| `\watch [seconds]`    | Re-execute the current query every specified number of seconds.     |
