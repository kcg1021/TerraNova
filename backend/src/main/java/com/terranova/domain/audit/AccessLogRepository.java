package com.terranova.domain.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 접속기록 Repository
 * - 개인정보보호법: 접속기록 조회 및 관리
 */
@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    /**
     * 사용자별 접속기록 조회
     */
    List<AccessLog> findByUsernameOrderByAccessTimeDesc(String username);

    /**
     * 기간별 접속기록 조회
     */
    @Query("SELECT a FROM AccessLog a WHERE a.accessTime BETWEEN :startTime AND :endTime ORDER BY a.accessTime DESC")
    List<AccessLog> findByAccessTimeBetween(@Param("startTime") LocalDateTime startTime, 
                                            @Param("endTime") LocalDateTime endTime);

    /**
     * 2년 이전 접속기록 조회 (법적 보관기간 만료)
     */
    @Query("SELECT a FROM AccessLog a WHERE a.accessTime < :cutoffDate")
    List<AccessLog> findExpiredLogs(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * IP 주소별 접속 횟수 조회 (보안 모니터링)
     */
    @Query("SELECT a.ipAddress, COUNT(a) FROM AccessLog a WHERE a.accessTime > :since GROUP BY a.ipAddress HAVING COUNT(a) > :threshold")
    List<Object[]> findSuspiciousIpAddresses(@Param("since") LocalDateTime since, 
                                             @Param("threshold") long threshold);
}
