create table tbl_inquiry_answer(
    id bigint unsigned auto_increment primary key,
    inquiry_answer varchar(1000),
    inquiry_id bigint unsigned not null,
    constraint fk_inquiry_answer_inquiry foreign key (inquiry_id)
    references tbl_inquiry(id)
);

select * from tbl_inquiry_answer;

drop table tbl_inquiry_answer;