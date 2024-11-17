package com.app.back.enums;

public enum AdminPostType {
    VOLUNTEER("봉사활동 모집글"),
    DONATION("기부 게시글"),
    SUPPORT("후원 게시글"),
    REVIEW("이용 후기"),
    NOTICE("공지사항"),
    INQUIRY("문의사항");

    private final String displayName;

    AdminPostType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    // displayName을 통해 AdminPostType을 가져오는 정적 메서드 추가
    public static AdminPostType fromDisplayName(String displayName) {
        for (AdminPostType type : AdminPostType.values()) {
            if (type.getDisplayName().equals(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown display name: " + displayName);
    }
}
