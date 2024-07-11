CREATE DATABASE mydatabase;
use mydatabase;
show databases;

CREATE TABLE TT_Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Fullname VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(200) NOT NULL,
    Mobileno VARCHAR(15), 
    Role VARCHAR(255),
    JoinDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM TT_Users;

CREATE TABLE TT_Questions (
    QuestionID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Question TEXT NOT NULL,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Que_prefix VARCHAR(255),
    Prog_topic VARCHAR(50),
    Prog_tech VARCHAR(50),
    Prog_lang VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES TT_Users(UserID) ON DELETE CASCADE
);

SELECT * FROM TT_Questions;

CREATE TABLE TT_Answers (
    AnswerID INT PRIMARY KEY AUTO_INCREMENT,
    QuestionID INT,
    UserID INT,
    Answer TEXT NOT NULL,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Ans_type INT,
    FOREIGN KEY (QuestionID) REFERENCES TT_Questions(QuestionID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES TT_Users(UserID) ON DELETE CASCADE
);

SELECT * FROM TT_Answers;

CREATE TABLE TT_Comments (
    CommentID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Comment TEXT NOT NULL,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES TT_Users(UserID) ON DELETE CASCADE
);

SELECT * FROM TT_Comments;

CREATE TABLE TT_Encyclopedia (
    EncyclopediaID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    QuestionID INT,
    AnswerID INT,
    CommentID INT,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES TT_Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (QuestionID) REFERENCES TT_Questions(QuestionID) ON DELETE CASCADE,
    FOREIGN KEY (AnswerID) REFERENCES TT_Answers(AnswerID) ON DELETE CASCADE,
    FOREIGN KEY (CommentID) REFERENCES TT_Comments(CommentID) ON DELETE CASCADE
);

SELECT * FROM TT_Encyclopedia;


INSERT INTO TT_Users (Fullname, Email, Password, Mobileno, Role, JoinDate) VALUES
('Alice Johnson', 'alice@example.com', 'password123', '1234567890', 'Admin', '2024-01-15'),
('Bob Smith', 'bob@example.com', 'password456', '0987654321', 'User', '2024-02-20'),
('Carol White', 'carol@example.com', 'password789', '1122334455', 'User', '2024-03-05');

INSERT INTO TT_Questions (UserID, Question, CreationDate, Que_prefix, Prog_topic, Prog_tech, Prog_lang) VALUES
(1, 'How to optimize SQL queries?', '2024-06-01', 'SQL', 'Database Optimization', 'MySQL', 'SQL'),
(2, 'What are the best practices for responsive web design?', '2024-06-10', 'Web Development', 'Design', 'CSS', 'HTML, CSS, JavaScript'),
(3, 'How to implement a linked list in Python?', '2024-06-15', 'Data Structures', 'Programming', 'Algorithm', 'Python');

INSERT INTO TT_Answers (QuestionID, UserID, Answer, CreationDate, Ans_type) VALUES
(1, 2, 'You can use indexes to optimize SQL queries.', '2024-06-02', 1),
(2, 3, 'Use media queries to make your web design responsive.', '2024-06-11', 1),
(3, 1, 'Here is a simple implementation of a linked list in Python.', '2024-06-16', 1);

INSERT INTO TT_Comments (UserID, Comment, CreationDate) VALUES
(2,  'Great question! Indexes can be very helpful.', '2024-06-01'),
(3,  'Thanks for the tips on responsive design.', '2024-06-11'),
(1,  'Nice explanation of linked lists!', '2024-06-16');

INSERT INTO TT_Encyclopedia (UserID, QuestionID, AnswerID, CommentID, CreationDate) VALUES
(1, 1, 1, 1, '2024-06-02'),
(2, 2, 2, 2, '2024-06-11'),
(3, 3, 3, 3, '2024-06-16');

SELECT * FROM TT_Users;

SELECT * FROM TT_Questions;

SELECT * FROM TT_Answers;

SELECT * FROM TT_Comments;

SELECT * FROM TT_Encyclopedia;

show tables;

ALTER TABLE TT_Comments
ADD AnswerID INT,
ADD FOREIGN KEY (AnswerID) REFERENCES TT_Answers(AnswerID) ON DELETE CASCADE;

