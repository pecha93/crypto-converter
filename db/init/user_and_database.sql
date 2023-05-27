CREATE USER cryptoconverter WITH ENCRYPTED PASSWORD '123456';

CREATE DATABASE cryptoconverter WITH
    OWNER = cryptoconverter
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
;
