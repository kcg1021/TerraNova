package com.terranova.service;

import com.terranova.domain.audit.AccessLog;
import com.terranova.domain.audit.AccessLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 접속기록 서비스
 * - 개인정보보호법 제29조: 접속기록 보관 의무 이행
 * - 비동기 처리로 성능 영향 최소화
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccessLogService {

    private final AccessLogRepository accessLogRepository;

    /**
     * 접속기록 저장 (비동기)
     * - 법적 필수: 사용자ID, 접속일시, IP주소, 처리내역 기록
     */
    @Async
    @Transactional
    public void saveAccessLog(HttpServletRequest request, String processedWork) {
        try {
            String username = getCurrentUsername();
            String ipAddress = getClientIp(request);
            String userAgent = request.getHeader("User-Agent");
            String sessionId = request.getSession(false) \!= null ? 
                              request.getSession(false).getId() : "N/A";

            AccessLog accessLog = AccessLog.builder()
                .username(username)
                .accessTime(LocalDateTime.now())
                .ipAddress(ipAddress)
                .requestUri(request.getRequestURI())
                .httpMethod(request.getMethod())
                .processedWork(processedWork)
                .result("SUCCESS")
                .userAgent(userAgent)
                .sessionId(sessionId)
                .build();

            accessLogRepository.save(accessLog);
            
            log.debug("[접속기록 저장] 사용자: {}, IP: {}, 작업: {}", 
                     username, ipAddress, processedWork);
                     
        } catch (Exception e) {
            log.error("접속기록 저장 실패", e);
        }
    }

    /**
     * 실패 접속기록 저장
     */
    @Async
    @Transactional
    public void saveFailedAccessLog(HttpServletRequest request, String processedWork, String errorMessage) {
        try {
            String username = getCurrentUsername();
            String ipAddress = getClientIp(request);

            AccessLog accessLog = AccessLog.builder()
                .username(username)
                .accessTime(LocalDateTime.now())
                .ipAddress(ipAddress)
                .requestUri(request.getRequestURI())
                .httpMethod(request.getMethod())
                .processedWork(processedWork)
                .result("FAILURE")
                .errorMessage(errorMessage)
                .build();

            accessLogRepository.save(accessLog);
            
        } catch (Exception e) {
            log.error("실패 접속기록 저장 실패", e);
        }
    }

    /**
     * 만료된 접속기록 삭제 (2년 보관 후)
     * - 배치 작업에서 호출
     */
    @Transactional
    public void deleteExpiredLogs() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusYears(2);
        var expiredLogs = accessLogRepository.findExpiredLogs(cutoffDate);
        
        if (\!expiredLogs.isEmpty()) {
            accessLogRepository.deleteAll(expiredLogs);
            log.info("[접속기록 삭제] {}건의 만료된 로그 삭제 완료", expiredLogs.size());
        }
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || \!authentication.isAuthenticated()) {
            return "anonymous";
        }
        return authentication.getName();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
