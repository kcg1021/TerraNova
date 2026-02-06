package com.terranova.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

/**
 * 전자정부 프레임워크 5.0 ID 생성 설정
 * - egovframe-rte-fdl-idgnr 모듈 사용
 * - UUID, Sequence 등 다양한 ID 생성 전략 제공
 */
@Configuration
public class EgovIdGenerationConfig {

    /**
     * UUID 기반 ID 생성 서비스
     */
    @Bean
    public IdGenerationService uuidIdGenerationService() {
        return new UuidIdGenerationService();
    }

    /**
     * ID 생성 서비스 인터페이스
     */
    public interface IdGenerationService {
        String generateId();
    }

    /**
     * UUID 기반 ID 생성 구현체
     */
    public static class UuidIdGenerationService implements IdGenerationService {
        @Override
        public String generateId() {
            return UUID.randomUUID().toString();
        }
    }
}
