package com.terranova.common;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 전자정부 프레임워크 공통 엔티티 Base
 * - 개인정보보호법 필수: 생성/수정 이력 자동 기록
 */
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    /**
     * 생성일시 (법적 필수)
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 생성자 (법적 필수 - 개인정보 접근 이력)
     */
    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false, length = 100)
    private String createdBy;

    /**
     * 수정일시 (법적 필수)
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 수정자 (법적 필수 - 개인정보 접근 이력)
     */
    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * 삭제 여부 (Soft Delete)
     */
    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    /**
     * Soft Delete 처리
     */
    public void delete() {
        this.deleted = true;
    }

    /**
     * Soft Delete 복구
     */
    public void restore() {
        this.deleted = false;
    }
}
