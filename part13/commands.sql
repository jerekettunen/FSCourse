CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values
('Edsger W. Dijkstra', 'https://www.cs.utexas.edu/~EWD/ewd00xx/EWD215.PDF', 'Notes on Structured Programming', 5);

insert into blogs (author, url, title, likes) values
(null, 'https://www.feynmanlectures.caltech.edu/II_01.html', 'The Feynman Lectures on Physics', 10);

SELECT * FROM blogs;