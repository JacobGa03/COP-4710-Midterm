-- Drop tables if they exists already
DROP TABLE IF EXISTS RSO_Member;

DROP TABLE IF EXISTS RSO_Event;

DROP TABLE IF EXISTS Public_Event;

DROP TABLE IF EXISTS Private_Event;

DROP TABLE IF EXISTS Comments;

DROP TABLE IF EXISTS Events;

DROP TABLE IF EXISTS At_Location;

DROP TABLE IF EXISTS RSO;

DROP TABLE IF EXISTS Students;

DROP TABLE IF EXISTS Super_Admins;

DROP TABLE IF EXISTS University;

CREATE TABLE
    University (
        u_id CHAR(36) NOT NULL,
        name VARCHAR(50),
        PRIMARY KEY (u_id)
    );

CREATE TABLE
    Students (
        stu_id CHAR(36) NOT NULL,
        password VARCHAR(64),
        email VARCHAR(50) UNIQUE NOT NULL,
        university CHAR(36) NOT NULL,
        name varchar(50) NOT NULL,
        PRIMARY KEY (stu_id),
        FOREIGN KEY (university) REFERENCES University (u_id)
    );

CREATE TABLE
    Super_Admins (
        sa_id CHAR(36) NOT NULL,
        password VARCHAR(64),
        email VARCHAR(50) UNIQUE NOT NULL,
        university CHAR(36),
        name varchar(50) NOT NULL,
        PRIMARY KEY (sa_id),
        FOREIGN KEY (university) REFERENCES University (u_id)
    );

CREATE TABLE
    At_Location (
        l_id CHAR(36) NOT NULL,
        location POINT,
        address VARCHAR(50),
        PRIMARY KEY (l_id),
        KEY (location, address)
    );

CREATE TABLE
    Events (
        e_id CHAR(36) NOT NULL,
        contact_info VARCHAR(40),
        name VARCHAR(50),
        description VARCHAR(150),
        time DATETIME,
        duration TIME, 
        category VARCHAR(50),
        location CHAR(36),
        PRIMARY KEY (e_id)
    );

CREATE TABLE
    Public_Event (
        `e_id` char(36) NOT NULL,
        approved_by CHAR(36),
        approval_status ENUM ('pending', 'approved', 'rejected') DEFAULT 'pending',
        PRIMARY KEY (`e_id`),
        FOREIGN KEY (e_id) REFERENCES Events (e_id),
        FOREIGN KEY (approved_by) REFERENCES Super_Admins (sa_id)
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
        status VARCHAR(10),
        PRIMARY KEY (rso_id),
        FOREIGN KEY (admin_id) REFERENCES Students (stu_id),
        FOREIGN KEY (associated_university) REFERENCES University (u_id)
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
        text VARCHAR(250),
        rating INT CHECK (rating BETWEEN 1 AND 5),
        PRIMARY KEY (c_id),
        FOREIGN KEY (e_id) REFERENCES Events (e_id),
        FOREIGN KEY (u_id) REFERENCES Students (stu_id)
    );

-- System triggers
DELIMITER $$
CREATE TRIGGER RSOStatusUpdateA
AFTER INSERT ON RSO_Member
FOR EACH ROW 
BEGIN
    IF ((SELECT COUNT(*) FROM RSO_Member M WHERE M.rso_id = NEW.rso_id) > 4)
    THEN
        -- Update teh RSO status to 'active'
        UPDATE RSO 
        SET Status = 'active'
        WHERE rso_id = NEW.rso_id;
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER RSOStatusUpdateP
AFTER DELETE ON RSO_Member
FOR EACH ROW
BEGIN
    IF (SELECT COUNT(*) FROM RSO_Member WHERE rso_id = OLD.rso_id) < 5 THEN
        -- Update the RSO status to 'inactive'
        UPDATE RSO
        SET Status = 'inactive'
        WHERE rso_id = OLD.rso_id;
    END IF;
END$$

DELIMITER ;