show databases;

create database test2;

use test2;

create table tbl_post (
    id bigint unsigned auto_increment primary key,
    post_title varchar(255) not null,
    post_content varchar(1000) not null,
    post_summary varchar(255),
    post_type varchar(100) not null,
    post_status varchar(100) default 'VISIBLE',
    post_view_count bigint default 0,
    member_id bigint unsigned not null ,
    created_date datetime default current_timestamp,
    updated_date datetime default  current_timestamp,
    constraint tbl_post_member foreign key (member_id)
      references tbl_member (id)
);

select * from tbl_post;


insert into tbl_post(id, post_title, post_summary, post_content,post_view_count, post_type, post_status, member_id)
values(151,'제목입니다zz','후원 요약zz1','후원 내용z1z',100,'VOLUNTEER','VISIBLE',2);

insert into tbl_post(id, post_title, post_summary, post_content,post_view_count, post_type, post_status, member_id)
values(78,'봉사 게시글 제목',  '봉사 요약','봉사 내용',1,'SUPPORT','VISIBLE',22);


SELECT * FROM tbl_post WHERE id = 1;


SHOW CREATE TABLE tbl_notice;
SHOW CREATE TABLE tbl_post;


drop table tbl_post;

insert into tbl_post(id, post_title, post_summary, post_content,post_view_count, post_type, post_status, member_id)
values(40,'뭐 어쩌구 도와주세요','기부요약','기부 내용1323',35,'DONATION',0,23);


DELIMITER $$

CREATE PROCEDURE insert_multiple_posts()
BEGIN
    DECLARE i INT DEFAULT 201;
    WHILE i <= 220 DO
            INSERT INTO tbl_post(id, post_title, post_summary, post_content, post_view_count, post_type, post_status, member_id)
            VALUES (i, CONCAT('제목입니다 ', i), CONCAT('후원 요약', i), CONCAT('후원 내용', i), i, 'INQUIRY', 'VISIBLE', 2);
            SET i = i + 1;
        END WHILE;
END$$

DELIMITER ;

CALL insert_multiple_posts();
DROP PROCEDURE insert_multiple_posts;


SELECT MAX(id) FROM tbl_post;
SELECT LAST_INSERT_ID();
