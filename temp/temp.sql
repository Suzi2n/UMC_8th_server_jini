USE umc_8th;
DROP TABLE IF EXISTS review_image;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS user_favor_category;
DROP TABLE IF EXISTS user_mission;
DROP TABLE IF EXISTS user_agree;
DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS food_category;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE,
    name VARCHAR(20),
    gender VARCHAR(10),
    birth DATE,
    address VARCHAR(40),
    detail_address VARCHAR(40),
    phone_number VARCHAR(13),
    status VARCHAR(15) DEFAULT 'active',
    inactive_date DATETIME(6),
    social_type VARCHAR(10),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    point INT DEFAULT 0
);

CREATE TABLE region (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id BIGINT,
    name VARCHAR(50),
    address VARCHAR(50),
    score FLOAT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (region_id) REFERENCES region(id)
);

CREATE TABLE terms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(20),
    body TEXT,
    optional BOOLEAN,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE food_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15),
    Column4 VARCHAR(15)
);

CREATE TABLE user_favor_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    food_category_id BIGINT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (food_category_id) REFERENCES food_category(id)
);

CREATE TABLE mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT,
    reward INT,
    deadline DATETIME,
    mission_spec TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE user_mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    mission_id BIGINT,
    status VARCHAR(15),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (mission_id) REFERENCES mission(id)
);

CREATE TABLE review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    store_id BIGINT,
    body TEXT,
    score FLOAT,
    created_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE review_image (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT,
    store_id BIGINT,
    image_url TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (review_id) REFERENCES review(id),
    FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE user_agree (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    terms_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (terms_id) REFERENCES terms(id)
);

INSERT INTO terms (title, body, optional, created_at, updated_at)
VALUES
('Privacy Policy', 'Details about privacy.', TRUE, NOW(), NOW()),
('Terms of Service', 'Details about service.', FALSE, NOW(), NOW());

INSERT INTO food_category (name, Column4)
VALUES
('한식', 'Food'),
('일식', 'Food'),
('중식', 'Food'),
('양식', 'Food'),
('치킨', 'Food'),
('분식', 'Food'),
('고기/구이', 'Food'),
('도시락', 'Food'),
('야식', 'Food'),
('패스트푸드', 'Food'),
('디저트', 'Food'),
('아시안푸드', 'Food');

INSERT INTO region (name, created_at, updated_at)
VALUES
('Seoul', NOW(), NOW()),
('Busan', NOW(), NOW());

-- Then insert into tables with single-level dependencies
INSERT INTO store (region_id, name, address, score, created_at, updated_at)
VALUES
(1, 'Awesome Store', '789 Store Ave', 4.5, NOW(), NOW()),
(2, 'Great Shop', '101 River Rd', 4.7, NOW(), NOW());

INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number, created_at, updated_at, point)
VALUES
('john@example.com', 'John Doe', 'Male', '1996-03-15', '123 Main St', 'Suite 100', '010-1111-1111', NOW(), NOW(), 100),
('jane@example.com', 'Jane Doe', 'Female', '1999-08-22', '456 Oak St', 'Apt 200', '010-2222-2222', NOW(), NOW(), 200);

INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at, updated_at)
VALUES
(1, 500, '2024-12-31 23:59:59', '15000원이상의 식사를 하세요!', NOW(), NOW()),
(2, 300, '2024-10-31 23:59:59', '12000원이상의 식사를 하세요!', NOW(), NOW());

-- Finally insert into tables with multi-level dependencies
INSERT INTO user_mission (user_id, mission_id, status, created_at, updated_at)
VALUES
(1, 1, '진행중', NOW(), NOW()),
(2, 2, '진행완료', NOW(), NOW());

-- Continue with other inserts
INSERT INTO review (user_id, store_id, body, score, created_at)
VALUES
(1, 1, 'Great experience!', 5.0, NOW()),
(2, 2, 'Nice shop!', 4.8, NOW());

INSERT INTO review_image (review_id, store_id, image_url, created_at, updated_at)
VALUES
(1, 1, 'http://example.com/image1.jpg', NOW(), NOW()),
(2, 2, 'http://example.com/image2.jpg', NOW(), NOW());

INSERT INTO user_agree (user_id, terms_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());

INSERT INTO user_favor_category (user_id, food_category_id, created_at, updated_at)
VALUES
(1, 1, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(2, 4, NOW(), NOW());