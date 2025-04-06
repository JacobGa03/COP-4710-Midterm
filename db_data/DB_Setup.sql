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
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address VARCHAR(100),
        PRIMARY KEY (l_id),
        UNIQUE KEY (latitude, longitude)
        );

CREATE TABLE
    Events (
        e_id CHAR(36) NOT NULL,
            contact_phone VARCHAR(60),
            contact_email VARCHAR(60),
            name VARCHAR(150),
            description VARCHAR(250),
            start_time DATETIME,
            end_time DATETIME, 
            category VARCHAR(50),
            location CHAR(36),
            room VARCHAR(50),
            PRIMARY KEY (e_id),
            FOREIGN KEY (location) REFERENCES At_Location (l_id)
    );

CREATE TABLE
    Public_Event (
        e_id char(36) NOT NULL,
        approved_by CHAR(36),
        approval_status ENUM ('pending', 'approved', 'rejected') DEFAULT 'pending',
        PRIMARY KEY (e_id),
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
        rating INT,
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
    IF ((SELECT COUNT(*) FROM RSO_Member M WHERE M.rso_id = NEW.rso_id) > 3)
    THEN
        -- Update teh RSO status to 'active'
        UPDATE RSO 
        SET Status = 'active'
        WHERE rso_id = NEW.rso_id;
    END IF;
END$$
DELIMITER $$

CREATE TRIGGER ValidateRating
BEFORE INSERT ON Comments
FOR EACH ROW
BEGIN
    IF NEW.rating NOT BETWEEN 1 AND 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;
END$$

DELIMITER ;


DELIMITER $$
CREATE TRIGGER RSOStatusUpdateP
AFTER DELETE ON RSO_Member
FOR EACH ROW
BEGIN
    IF (SELECT COUNT(*) FROM RSO_Member WHERE rso_id = OLD.rso_id) < 4 THEN
        -- Update the RSO status to 'inactive'
        UPDATE RSO
        SET Status = 'inactive'
        WHERE rso_id = OLD.rso_id;
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER CheckOverlappingEvents
BEFORE INSERT ON Events
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT;

    -- Check for overlapping events at the same location
    SELECT COUNT(*)
    INTO overlap_count
    FROM Events
    WHERE location = NEW.location AND room = NEW.room
    AND (
        (NEW.start_time BETWEEN start_time AND end_time)
        OR (NEW.end_time BETWEEN start_time AND end_time)
        OR (start_time BETWEEN NEW.start_time AND NEW.end_time)
    );

    -- If overlapping events exist, throw an error
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Overlapping events are not allowed at the same location';
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
('553814bc-11c2-11f0-b6c4-0242ac140002', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student8@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Emily Carter'),
('5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student5@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Ethan Hunt'),
('6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student6@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Fiona Gallagher'),
('79acd6fc-11c2-11f0-b6c4-0242ac140002', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student9@example.com', '349dab72-0374-11f0-86aa-0242ac140002', 'Jacob Thompson'),
('e704cb52-081d-11f0-ab35-0242ac140002', '2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892', 'student7@example.com', 'e70427b5-081d-11f0-ab35-0242ac140002', 'Eve Lancey');

INSERT INTO RSO(rso_id, admin_id, name, associated_university, status, category, description) VALUES
('1204c1e1-11b5-11f0-b6c4-0242ac140002', '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', 'League of Voters', '349dab72-0374-11f0-86aa-0242ac140002', 'inactive', 'Political', 'Sign up and exercise your civic right.'),
('22f71a85-11b5-11f0-b6c4-0242ac140002', '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', 'English Knights', '349dab72-0374-11f0-86aa-0242ac140002', 'active', 'Educational', 'We love reading and literature.'),
('4b3d20b6-081e-11f0-ab35-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', 'Chess Knights', '349dab72-0374-11f0-86aa-0242ac140002', 'inactive', NULL, NULL),
('527a88ce-11b4-11f0-b6c4-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Coding Knights', '349dab72-0374-11f0-86aa-0242ac140002', 'inactive', 'Tech', 'We love coding!'),
('58e892ab-11b5-11f0-b6c4-0242ac140002', '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', 'Marching Knights', '349dab72-0374-11f0-86aa-0242ac140002', 'inactive', 'Music', 'We love to march for the UCF football team.'),
('5dd94b0f-081e-11f0-ab35-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', 'Graduate Student Association', '349dab72-0374-11f0-86aa-0242ac140002', 'inactive', NULL, NULL),
('9a041f13-0381-11f0-b6af-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'UCF Jazz Appreciators', '349dab72-0374-11f0-86aa-0242ac140002', 'inactive', NULL, NULL),
('a6ced1e5-0821-11f0-ab35-0242ac140002', 'e704cb52-081d-11f0-ab35-0242ac140002', 'Chess @ USF', 'e70427b5-081d-11f0-ab35-0242ac140002', 'inactive', NULL, NULL);

INSERT INTO RSO_Member (rso_id, stu_id) VALUES
('22f71a85-11b5-11f0-b6c4-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('22f71a85-11b5-11f0-b6c4-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q'),
('9a041f13-0381-11f0-b6af-0242ac140002', '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q'),
('22f71a85-11b5-11f0-b6c4-0242ac140002', '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s'),
('4b3d20b6-081e-11f0-ab35-0242ac140002', '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s'),
('5dd94b0f-081e-11f0-ab35-0242ac140002', '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s'),
('22f71a85-11b5-11f0-b6c4-0242ac140002', '553814bc-11c2-11f0-b6c4-0242ac140002'),
('22f71a85-11b5-11f0-b6c4-0242ac140002', '79acd6fc-11c2-11f0-b6c4-0242ac140002');

INSERT INTO At_Location (l_id, latitude, longitude, address) VALUES
('99cce850-0fd4-11f0-bcfe-0242ac140002', 28.6018701, -81.1987556, 'UCF Engineering II (ENG2)'),
('c1203ffd-0fd4-11f0-bcfe-0242ac140002', 28.6047546, -81.1987911, 'Memory Mall'),
('e6a18e85-0fd4-11f0-bcfe-0242ac140002', 28.605286, -81.19902599999999, 'UCF Career Services and Experiential Learning (CSEL)');

INSERT INTO Events (e_id, contact_phone, contact_email, name, description, start_time, end_time, category, location, room) VALUES
('5106bd65-11c6-11f0-b6c4-0242ac140002', '9873214560', 'ab123423@ucf.edu', 'Knight Hacks GBM', 'Come for the Hax!', '2025-04-14 21:30:00', '2025-04-14 23:30:00', 'General', '99cce850-0fd4-11f0-bcfe-0242ac140002', '201'),
('99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '9876543210', 'sm123422@ucf.edu', 'FE Prep Session', 'Come practice some FE questions before the next exam!', '2025-04-09 21:30:00', '2025-04-09 23:30:00', 'Educational', '99cce850-0fd4-11f0-bcfe-0242ac140002', '237'),
('b70aaaa2-11c5-11f0-b6c4-0242ac140002', '1236549870', 'ab124324@ucf.edu', 'Wiki Races', 'Come for a wiki races.', '2025-04-20 23:30:00', '2025-04-21 01:30:00', 'Social', '99cce850-0fd4-11f0-bcfe-0242ac140002', ''),
('baf81a8c-11c7-11f0-b6c4-0242ac140002', '987654654', 'ab12342@ucf.edu', 'Knight Hax 2', '', '2025-04-14 21:30:00', '2025-04-14 22:30:00', 'Tech', '99cce850-0fd4-11f0-bcfe-0242ac140002', ''),
('e6a20c8a-0fd4-11f0-bcfe-0242ac140002', '9786453120', 'za209320@ucf.edu', 'Resume Review', 'Come get your resume reviewed by our career professionals.', '2025-04-10 18:00:00', '2025-04-10 19:30:00', 'Professional', 'e6a18e85-0fd4-11f0-bcfe-0242ac140002', NULL);

INSERT INTO Private_Event (e_id, associated_uni) VALUES
('5106bd65-11c6-11f0-b6c4-0242ac140002', '349dab72-0374-11f0-86aa-0242ac140002'),
('99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '349dab72-0374-11f0-86aa-0242ac140002'),
('b70aaaa2-11c5-11f0-b6c4-0242ac140002', '349dab72-0374-11f0-86aa-0242ac140002'),
('baf81a8c-11c7-11f0-b6c4-0242ac140002', '349dab72-0374-11f0-86aa-0242ac140002'),
('e6a20c8a-0fd4-11f0-bcfe-0242ac140002', '349dab72-0374-11f0-86aa-0242ac140002');

INSERT INTO Comments (c_id, e_id, u_id, text, rating) VALUES
('1dd9a0ea-10b2-11f0-8d56-a2a285eb5b7b', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Wow, thanks to all the TAs who help make this possible.', 3),
('24dd5a70-10b2-11f0-8d56-a2a285eb5b7b', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Wow, thanks to all the TAs who help make this possible.', 5),
('3b35f113-10b7-11f0-8d56-a2a285eb5b7b', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', 'Who\'s ready?', 4),
('49fd872f-0fd6-11f0-a183-0242ac140002', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'I\'m sooo ready. We will all pass on our first attempt', 5),
('4e8f35c5-10b0-11f0-8d56-a2a285eb5b7b', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Woop!', 5),
('54b581bb-10b4-11f0-8d56-a2a285eb5b7b', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Let\'s get coding!!', 5),
('597e870f-10b4-11f0-8d56-a2a285eb5b7b', '99cd4f0e-0fd4-11f0-bcfe-0242ac140002', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'Let\'s get coding!!', 5);