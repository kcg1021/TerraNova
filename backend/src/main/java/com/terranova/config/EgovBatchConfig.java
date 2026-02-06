package com.terranova.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 전자정부 프레임워크 5.0 배치 작업 설정
 * - 법적 필수: 접속기록 자동 정리 (2년 보관 후 삭제)
 * - 개인정보 파기 배치 작업
 */
@Configuration
@EnableScheduling
@EnableAsync
public class EgovBatchConfig {
    // Spring Batch 설정은 필요 시 추가
}
