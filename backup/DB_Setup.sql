CREATE TABLE Events(
e_id CHAR(36) NOT NULL,
contact_info VARCHAR(20),
name VARCHAR(20),
description VARCHAR(150),
time DATETIME,
category VARCHAR(20),
location CHAR(36),
PRIMARY KEY (e_id));

CREATE TABLE Private_Event(
e_id CHAR(36) NOT NULL,
associated_uni CHAR(36),
PRIMARY KEY (e_id));