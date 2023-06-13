drop database if exists employeedatabase;

create database employeedatabase;

use employeedatabase;

create table department (
  id int not null auto_increment,
  name varchar(45) null,
  primary key (id)
);

create table employee (
  id int not null auto_increment,
  first_name varchar(45) null,
  last_name varchar(45) null,
  job_id int null,
  manager_id int null,
  primary key (id),
  foreign key (job_id) references job(id),
  foreign key (manager_id) references employee(id)
);
