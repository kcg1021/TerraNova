package com.terranova.aspect;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * 전자정부 프레임워크 로깅 AOP
 * - 개인정보보호법 필수: 접속기록 보관 의무
 * - 사용자 식별자, 접속일시, 접속지 정보, 처리한 업무 기록
 */
@Slf4j
@Aspect
@Component
public class LoggingAspect {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Controller 메서드 실행 전후 로깅
     * - 법적 필수: 접속기록 보관
     */
    @Around("execution(* com.terranova.*.controller..*(..))")
    public Object logControllerMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 요청 정보 추출
        HttpServletRequest request = getCurrentRequest();
        String username = getCurrentUsername();
        String method = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        
        // 접속 로그 기록 (법적 필수)
        log.info("[접속기록] 시간: {}, 사용자: {}, IP: {}, 경로: {}, 메서드: {}.{}, 파라미터: {}",
            LocalDateTime.now().format(FORMATTER),
            username,
            getClientIp(request),
            request != null ? request.getRequestURI() : "N/A",
            className,
            method,
            Arrays.toString(joinPoint.getArgs())
        );

        try {
            Object result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            
            // 처리 완료 로그
            log.info("[처리완료] 사용자: {}, 메서드: {}.{}, 실행시간: {}ms",
                username, className, method, executionTime
            );
            
            return result;
            
        } catch (Exception e) {
            // 오류 로그 (법적 필수)
            log.error("[오류발생] 사용자: {}, 메서드: {}.{}, 오류: {}",
                username, className, method, e.getMessage(), e
            );
            throw e;
        }
    }

    /**
     * 데이터 변경 작업 로깅 (개인정보 접근 이력)
     */
    @AfterReturning(pointcut = "execution(* com.terranova.*.service..*(..)) && " +
                               "(execution(* *.save*(..)) || execution(* *.update*(..)) || execution(* *.delete*(..)))",
                    returning = "result")
    public void logDataModification(JoinPoint joinPoint, Object result) {
        String username = getCurrentUsername();
        String method = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        
        // 개인정보 변경 이력 기록 (법적 필수)
        log.info("[데이터변경] 시간: {}, 사용자: {}, 작업: {}.{}, 파라미터: {}, 결과: {}",
            LocalDateTime.now().format(FORMATTER),
            username,
            className,
            method,
            Arrays.toString(joinPoint.getArgs()),
            result != null ? result.getClass().getSimpleName() : "void"
        );
    }

    /**
     * 현재 요청 정보 조회
     */
    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes = 
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }

    /**
     * 현재 사용자명 조회
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "anonymous";
        }
        return authentication.getName();
    }

    /**
     * 클라이언트 IP 주소 조회
     */
    private String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return "N/A";
        }
        
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        return ip;
    }
}
