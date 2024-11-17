create table tbl_report(
    id bigint unsigned auto_increment primary key,
    report_reason varchar(1000) not null,
    report_status varchar(100) default 'WAITING',
    post_id bigint unsigned not null,
    member_id bigint unsigned not null,
    reported_member_id bigint unsigned not null,
    created_date datetime default current_timestamp,
    updated_date datetime default  current_timestamp,
    constraint fk_report_post foreign key (post_id)
    references tbl_post(id),
    constraint fk_report_member foreign key (member_id)
    references tbl_member(id)
);

select * from tbl_report;

drop table tbl_report;

alter table tbl_report add column reported_member_id bigint unsigned not null;




