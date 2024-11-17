use test2;

show databases ;

create database test2;

create table tbl_member (
    id bigint unsigned auto_increment primary key,
    kakao_email varchar(255),
    kakao_profile_url varchar(255),
    kakao_nickname varchar(255),
    member_email varchar(255),
    member_name varchar(255),
    member_phone varchar(255),
    member_password varchar(255),
    member_type varchar(100) default 'NORMAL',
    member_nickname varchar(255),
    member_jung int default 0,
    member_point int default 0,
    member_login_type varchar(100) default 'NORMAL',
    member_star_rate decimal(3, 2) default 0.00,
    member_introduction varchar(1000),
    created_date datetime default current_timestamp,
    updated_date datetime default current_timestamp
);
select * from tbl_member;


# UPDATE tbl_member
# SET member_star_rate = 1.00
# WHERE id = 6;
insert into tbl_member(id, member_email, member_password, member_nickname,member_login_type)
values(777, '윤주현@naver.com', '1234567', '관리자윤주현','ADMIN');


insert into tbl_member(id, member_email, member_password, member_nickname)
values(33, '결제테스트@naver.com', '1234567', '결제테스트용아이디');

# alter table tbl_member
#     modify column member_type smallint not null;
#
# alter table tbl_member
#     modify column member_jung int default 0;
#
# alter table tbl_member
#     modify column member_point int default 0;
#
# DROP TABLE tbl_member;

select * from tbl_member;


alter table tbl_member
add column reset_uuid varchar(255) unique;

delete from tbl_member
where id > 30;

SELECT reset_uuid FROM tbl_member WHERE reset_uuid IS NOT NULL;

UPDATE tbl_member
SET reset_uuid = '98a8eb28-1a1a-401e-b302-c1e033ee12b4'
WHERE member_email = 'ljm21000@gmail.com';


update tbl_member
set member_name = '헌혈의 집(역삼)'
where id = 22;

insert into tbl_member (member_email,member_name, member_phone,member_password)
values ('746aa1357@gmail.com','양승민','010-4452-9003', 1234567);




UPDATE tbl_member
set member_point = 10000
where id = 23;

INSERT INTO tbl_member (member_email, member_name, member_nickname, member_phone, member_password)
VALUES
    ('user1@naver.com', '김철수', '철수짱', '010-1234-5678', 'password1'),
    ('user2@naver.com', '이영희', '영희짱', '010-2345-6789', 'password2'),
    ('user3@naver.com', '박민수', '민수최고', '010-3456-7890', 'password3'),
    ('user4@naver.com', '최수정', '수정공주', '010-4567-8901', 'password4'),
    ('user5@naver.com', '장희진', '희진짱', '010-5678-9012', 'password5'),
    ('user6@naver.com', '오준석', '준석형님', '010-6789-0123', 'password6'),
    ('user7@naver.com', '정수빈', '수빈사랑', '010-7890-1234', 'password7'),
    ('user8@naver.com', '한예린', '예린스타', '010-8901-2345', 'password8'),
    ('user9@naver.com', '김지훈', '지훈천재', '010-9012-3456', 'password9'),
    ('user10@naver.com', '박서현', '서현짱짱', '010-0123-4567', 'password10');



insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('a12345@naver.com','대한적십자사','010-1111-1111', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('a45678@naver.com','유니세프','010-2222-2222', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('cvc1245@naver.com','월드비전','010-3333-3333', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('3df45s@naver.com','굿네이버스','010-4444-4444', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('zz9845@naver.com','유니세프 한국위원회','010-5555-5555', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('d7ee8d@naver.com','초록우산 어린이재단','010-6666-6666', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('34d5fs6@naver.com','푸드뱅크','010-7777-7777', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('xs12f6@naver.com','세이브더칠드런','010-8888-8888', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('554ds8fx@naver.com','밀알복지재단','010-9999-9999', 1234567, 'ORGANIZATION');
insert into tbl_member (member_email,member_name, member_phone,member_password, member_type)
values ('vd8e7d@naver.com','국제구호개발기구','010-1010-1010', 1234567, 'ORGANIZATION');

