

create table tbl_vt_application(
    id bigint unsigned auto_increment primary key ,
    created_date datetime default current_timestamp,
    application_status varchar(100) default 'WAITING',
    vt_id bigint unsigned not null,
    member_id bigint unsigned not null ,
    constraint fk_vt_application_vt foreign key(vt_id)
                               references tbl_vt(id),
    constraint fk_vt_application_member foreign key (member_id)
                               references tbl_member(id)
);


select *from tbl_vt_application;

insert into tbl_vt_application(created_date, application_status, vt_id, member_id)
VALUES (current_timestamp, 'APPROVED',77,16);

delete from tbl_vt_application
where id = 5;

