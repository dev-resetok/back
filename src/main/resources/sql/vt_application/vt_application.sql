

create table tbl_vt_application(
    id bigint unsigned auto_increment primary key ,
    created_date datetime default current_timestamp,
    vt_id bigint unsigned not null,
    member_id bigint unsigned not null ,
    constraint fk_vt_application_vt foreign key(vt_id)
                               references tbl_vt(id),
    constraint fk_vt_application_member foreign key (member_id)
                               references tbl_member(id)
);

