create table tbl_notice(
    id bigint unsigned auto_increment primary key,
    constraint fk_notice_post foreign key (id)
    references tbl_post(id)
);

select * from tbl_notice;

drop table tbl_notice;