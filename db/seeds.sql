USE employee_db

INSERT INTO department(name)

VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role(title, salary, department_id)
VALUES  ('Sales Lead',100000.00,1),
        ('Salesperson',80000.00,1),
        ('Lead Engineer',150000.00,2),
        ('software Engineer',120000.00,2),
        ('Account Manager',160000.00,3),
        ('Accountant',125000.00,3),
        ('Legal Team lead',250000.00,4),
        ('Lawyer',190000.00,4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ('Jordan', 'Belfort', 1, null),
        ('Thomas R', 'Callahan III', 2, 1),
        ('Stanley', 'Jobson', 3, null),
        ('Zero', 'Cool', 4, 3),
        ('Andy', 'Dufresne', 5, null),
        ('Oscar', 'Wallace', 6, 5),
        ('Lieutenant Daniel', 'Kaffee', 7, null),
        ('Erin', 'Brockovich', 8, 7);
