create table tbl_attachment(
    id bigint unsigned auto_increment primary key,
    attachment_file_name varchar(255) not null,
    attachment_file_real_name varchar(255) not null,
    attachment_file_path varchar(255) not null,
    attachment_file_size varchar(255) not null,
    attachment_file_type varchar(255) not null,
    post_id bigint unsigned not null,
    created_date datetime default current_timestamp,
    constraint fk_attachment_post foreign key (post_id)
    references tbl_post(id)
);

select * from tbl_attachment;

show databases;

# - 컬럼 타입 변경
# ALTER TABLE [테이블명] MODIFY [컬럼명] [변경할 컬럼타입];

# ALTER TABLE [테이블명] ADD [컬럼명] [자료형] [제약조건] after [기존 컬럼명];
alter table tbl_attachment add column attachment_file_real_name varchar(255) not null;

insert into tbl_attachment(id,attachment_file_name,attachment_file_real_name,attachment_file_path,attachment_file_size,attachment_file_type,post_id)
values (1,'테스트이름','테스트 진짜 이름','테스트path','테스트size','테스트type',1);

delete from tbl_attachment where id = 6;