package com.terranova.domain.user;

import com.terranova.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 사용자 엔티티
 * - JPA 사용 (간단한 CRUD)
 * - 개인정보보호법 준수: 암호화 필수 필드 포함
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_username", columnList = "username")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", length = 36)
    private String id;

    /**
     * 사용자명 (로그인 ID)
     */
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    /**
     * 비밀번호 (BCrypt 암호화)
     */
    @Column(name = "password", nullable = false, length = 200)
    private String password;

    /**
     * 이메일
     */
    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    /**
     * 이름
     */
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /**
     * 전화번호 (암호화 필요)
     */
    @Column(name = "phone", length = 20)
    private String phone;

    /**
     * 역할 (USER, ADMIN 등)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    /**
     * 계정 활성화 여부
     */
    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;

    /**
     * 비밀번호 변경
     */
    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    /**
     * 사용자 정보 수정
     */
    public void updateInfo(String email, String name, String phone) {
        this.email = email;
        this.name = name;
        this.phone = phone;
    }

    /**
     * 계정 비활성화
     */
    public void disable() {
        this.enabled = false;
    }

    /**
     * 계정 활성화
     */
    public void enable() {
        this.enabled = true;
    }
}
