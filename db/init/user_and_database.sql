CREATE USER qr_it WITH ENCRYPTED PASSWORD 'qr_it';

CREATE DATABASE qr_it WITH
    OWNER = qr_it
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
;
