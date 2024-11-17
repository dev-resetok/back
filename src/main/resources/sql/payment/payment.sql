create table tbl_payment(
    id bigint unsigned auto_increment primary key,
    payment_status varchar(100) default 'COMPLETED',
    payment_amount int default 0,
    member_id bigint unsigned not null,
    created_date datetime default current_timestamp,
    updated_date datetime default current_timestamp,
    constraint fk_payment_member foreign key (member_id)
    references tbl_member(id)
);

select * from tbl_payment;


alter table tbl_payment
    modify column payment_status varchar(100) default 'COMPLETED';

insert into tbl_payment
values (1,'COMPLETED',10000,23,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)

delete from tbl_payment
where member_id = 33;


