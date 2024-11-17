use test2;

create table tbl_vt_record(
    id bigint unsigned primary key ,
    vt_time smallint default 0,
    vt_date date not null,
    constraint tbl_vt_record_application foreign key(id)
                          references tbl_vt_application(id)

);

select * from tbl_vt_record;

insert into tbl_vt_record(id, vt_time, vt_date)
VALUES (79,2, current_timestamp);

alter table tbl_vt_record add column     vt_date date not null;

delete from tbl_vt_record
where id = 78;
