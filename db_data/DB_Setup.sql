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
        PRIMARY KEY (sa_id)
    );

CREATE TABLE
    At_Location (
        l_id CHAR(36) NOT NULL,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL,
        address VARCHAR(100),
        PRIMARY KEY (l_id),
        KEY (latitude, longitude)
    );

CREATE TABLE
    Events (
        e_id CHAR(36) NOT NULL,
        contact_info VARCHAR(60),
        name VARCHAR(50),
        description VARCHAR(250),
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
        status ENUM ('inactive', 'active') DEFAULT 'inactive',
        category VARCHAR(50),
        description VARCHAR(250),
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

-- Default insert statements

INSERT INTO University (u_id, name) VALUES
('349dab72-0374-11f0-86aa-0242ac140002', 'University of Central Florida'),
('e70427b5-081d-11f0-ab35-0242ac140002', 'University of South Florida-Main Campus');

INSERT INTO Super_Admins (sa_id, password, email, university, name) VALUES 
('316aec42-0b70-11f0-b2a6-0242ac140002', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'admin1@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'John Doe');

INSERT INTO Students (stu_id, password, email, university, name) VALUES
('1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student1@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Alice Smith'),
('2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student2@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Bob Johnson'),
('3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student3@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Charlie Brown'),
('4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student4@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Diana Prince'),
('5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student5@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Ethan Hunt'),
('6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student6@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Fiona Gallagher'),
('e704cb52-081d-11f0-ab35-0242ac140002', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student7@example.com', 'e70427b5-081d-11f0-ab35-0242ac140002', 'Eve Lancey');

INSERT INTO RSO (rso_id, admin_id, name, associated_university) VALUES
('9a041f13-0381-11f0-b6af-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'UCF Jazz Appreciators', '349dab72-0374-11f0-86aa-0242ac140002'),
('4b3d20b6-081e-11f0-ab35-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', 'Chess Knights', '349dab72-0374-11f0-86aa-0242ac140002'),
('5dd94b0f-081e-11f0-ab35-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', 'Graduate Student Association', '349dab72-0374-11f0-86aa-0242ac140002'),
('a6ced1e5-0821-11f0-ab35-0242ac140002', 'e704cb52-081d-11f0-ab35-0242ac140002', 'Chess @ USF', 'e70427b5-081d-11f0-ab35-0242ac140002');

INSERT INTO RSO_Member(rso_id, stu_id) VALUES
('9a041f13-0381-11f0-b6af-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q');