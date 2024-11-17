create table tbl_inquiry(
    id bigint unsigned auto_increment primary key,
    inquiry_status varchar(100) default 'WAITING',
    inquiry_email varchar(255) not null ,
    inquiry_phone varchar(255),
    inquiry_type varchar(255) not null ,
    constraint fk_inquiry_post foreign key (id)
    references tbl_post(id)
);

select * from tbl_inquiry;

alter table tbl_inquiry add column inquiry_type varchar(255) not null`` ;


drop table tbl_inquiry;