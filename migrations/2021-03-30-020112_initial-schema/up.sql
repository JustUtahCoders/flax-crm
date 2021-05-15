CREATE TABLE nouns (
  noun_id SERIAL PRIMARY KEY,
  table_name VARCHAR(128),
  slug VARCHAR(128),
  friendly_name VARCHAR(256),
  parent_id INT,
  CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES nouns(noun_id)
);