/* Department table */
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Accounting'),
  ('Engineering');

/* Employee table */
INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES
  ('Thierry', 'Henry', 1, NULL),
  ('Gabriel', 'Jesus', 2, 1),
  ('Martin', 'Odegaard', 3, 2);
