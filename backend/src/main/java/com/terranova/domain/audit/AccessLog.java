package com.terranova.domain.audit;

import com.terranova.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 접속기록 엔티티
 * - 개인정보보호법 제29조: 접속기록 보관 의무
 * - 보관기간: 2년 이상 (고유식별정보, 민감정보 처리 시스템)
 * - 기록 항목: 사용자ID, 접속일시, IP주소, 접속경로, 처리내역
 */
@Entity
@Table(name = "tb_access_log", indexes = {
    @Index(name = "idx_username_access_time", columnList = "username, accessTime"),
    @Index(name = "idx_access_time", columnList = "accessTime")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AccessLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(nullable = false)
    private LocalDateTime accessTime;

    @Column(nullable = false, length = 45)
    private String ipAddress;

    @Column(length = 500)
    private String requestUri;

    @Column(length = 10)
    private String httpMethod;

    @Column(length = 200)
    private String processedWork;

    @Column(length = 20)
    private String result;

    @Column(length = 1000)
    private String errorMessage;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 100)
    private String sessionId;

    private Long executionTime;

    @Builder
    public AccessLog(String username, LocalDateTime accessTime, String ipAddress,
                    String requestUri, String httpMethod, String processedWork,
                    String result, String errorMessage, String userAgent,
                    String sessionId, Long executionTime) {
        this.username = username;
        this.accessTime = accessTime;
        this.ipAddress = ipAddress;
        this.requestUri = requestUri;
        this.httpMethod = httpMethod;
        this.processedWork = processedWork;
        this.result = result;
        this.errorMessage = errorMessage;
        this.userAgent = userAgent;
        this.sessionId = sessionId;
        this.executionTime = executionTime;
    }

    public void markSuccess() {
        this.result = "SUCCESS";
    }

    public void markFailure(String errorMessage) {
        this.result = "FAILURE";
        this.errorMessage = errorMessage;
    }
}
