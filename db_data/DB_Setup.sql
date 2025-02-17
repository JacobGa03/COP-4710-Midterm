CREATE TABLE
    University (
        u_id CHAR(36) NOT NULL,
        name VARCHAR(40),
        PRIMARY KEY (u_id)
    );

CREATE TABLE
    Students (
        stu_id CHAR(36) NOT NULL,
        password VARCHAR(64),
        email VARCHAR(30) UNIQUE,
        university CHAR(36),
        PRIMARY KEY (stu_id)
    );

CREATE TABLE
    Events (
        e_id CHAR(36) NOT NULL,
        contact_info VARCHAR(20),
        name VARCHAR(20),
        description VARCHAR(150),
        time DATETIME,
        category VARCHAR(20),
        location CHAR(36),
        PRIMARY KEY (e_id)
    );

CREATE TABLE
    Private_Event (
        e_id CHAR(36) NOT NULL,
        associated_uni CHAR(36),
        PRIMARY KEY (e_id),
        FOREIGN KEY (e_id) REFERENCES Events (e_id),
        FOREIGN KEY (associated_uni) REFERENCES University (u_id)
    );

CREATE TABLE
    RSO (
        rso_id CHAR(36) NOT NULL,
        admin_id CHAR(36) NOT NULL,
        name VARCHAR(30),
        associated_university CHAR(36),
        member_count INT,
        PRIMARY KEY (rso_id)
    );

CREATE TABLE
    RSO_Event (
        e_id CHAR(36) NOT NULL,
        related_RSO CHAR(36),
        associated_uni CHAR(36),
        PRIMARY KEY (e_id),
        FOREIGN KEY (e_id) REFERENCES Events (e_id),
        FOREIGN KEY (related_RSO) REFERENCES RSO (rso_id),
        FOREIGN KEY (associated_uni) REFERENCES University (u_id)
    );

CREATE TABLE
    Super_Admins (
        sa_id CHAR(36) NOT NULL,
        password VARCHAR(64),
        email VARCHAR(30) UNIQUE,
        university CHAR(36),
        PRIMARY KEY (sa_id)
    );

CREATE TABLE
    RSO_Member (
        rso_id CHAR(36) NOT NULL,
        stu_id CHAR(36) NOT NULL,
        PRIMARY KEY (rso_id, stu_id),
        FOREIGN KEY (rso_id) REFERENCES RSO (rso_id),
        FOREIGN KEY (stu_id) REFERENCES Students (stu_id)
    );

CREATE TABLE
    Comments (
        c_id CHAR(36) NOT NULL,
        e_id CHAR(36) NOT NULL,
        u_id CHAR(36) NOT NULL,
        text VARCHAR(150),
        rating INT,
        PRIMARY KEY (c_id),
        FOREIGN KEY (e_id) REFERENCES Events (e_id),
        FOREIGN KEY (u_id) REFERENCES Students (stu_id)
    );

CREATE TABLE
    At_Location (
        l_id CHAR(36) NOT NULL,
        location POINT,
        address VARCHAR(50),
        PRIMARY KEY (l_id)
    );