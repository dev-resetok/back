create table tbl_notice(
    id bigint unsigned auto_increment primary key,
    constraint fk_notice_post foreign key (id)
    references tbl_post(id)
);

select * from tbl_notice;

drop table tbl_notice;


-- `tbl_notice` 테이블의 외래 키 제약 조건 확인
show create table tbl_notice;



ALTER TABLE tbl_notice
    DROP FOREIGN KEY fk_notice_post;

# 이거 해야 해 하면 지워
ALTER TABLE tbl_notice
    ADD CONSTRAINT fk_notice_post FOREIGN KEY (id)
        REFERENCES tbl_post(id) ON DELETE CASCADE;
