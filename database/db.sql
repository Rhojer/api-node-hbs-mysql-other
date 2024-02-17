CREATE DATABASE database_links;

USE database_links;

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password varchar (60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE links(
    id INT(11) NOT NULL,
    tittle VARCHAR(150) NOT NULL,
    url VARCHAR(250) NOT NULL,
    description TEXT.
    user_id INT(11),
    create_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAIN fk_user FOREING KEY (user_id) REFERENCE users(id)
)
ALTER TABLE links
	ADD PRIMARY KEY (id);

ALTER TABLE links
	MODIFY id INT(11) NOT NULL AUTO_INCREMENT