create table tbl_support_record(
    id bigint unsigned auto_increment primary key,
    member_id bigint unsigned not null,
    support_id bigint unsigned not null,
    support_amount int unsigned,
    created_date datetime default current_timestamp,
    constraint fk_support_record_member foreign key (member_id)
    references tbl_member(id),
    constraint fk_support_record_support foreign key (support_id)
    references tbl_support(id)
);

select * from tbl_support_record;