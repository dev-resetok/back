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
values(3, '윤주현@naver.com', '1234567', '결제테스트용아이디','ADMIN');


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
where id = 9;

SELECT reset_uuid FROM tbl_member WHERE reset_uuid IS NOT NULL;

UPDATE tbl_member
SET reset_uuid = '98a8eb28-1a1a-401e-b302-c1e033ee12b4'
WHERE member_email = 'ljm21000@gmail.com';

delete from tbl_member
where id=33;