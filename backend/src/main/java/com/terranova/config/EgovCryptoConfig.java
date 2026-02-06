package com.terranova.config;

import org.egovframe.rte.fdl.cryptography.EgovCryptoService;
import org.egovframe.rte.fdl.cryptography.EgovPasswordEncoder;
import org.egovframe.rte.fdl.cryptography.impl.EgovARIACryptoServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 전자정부 프레임워크 5.0 암호화 설정
 * - 개인정보보호법 필수: ARIA 기반 암호화/복호화
 * - 주민등록번호, 카드번호 등 개인정보 암호화 (법적 필수)
 * - 비밀번호는 단방향 암호화 (BCrypt)
 */
@Configuration
public class EgovCryptoConfig {

    @Value("${egov.crypto.key:egovframe-terranova-2026-secret-key-32bytes!!}")
    private String cryptoKey;

    @Value("${egov.crypto.initial-vector:1234567890123456}")
    private String initialVector;

    /**
     * ARIA 암호화 서비스 (전자정부 프레임워크 표준)
     * - 개인정보보호법 제24조의2: 주민등록번호 등 암호화 의무
     * - ARIA 블록 암호 알고리즘 사용 (국가보안기술연구소 개발)
     * - 대칭키 암호화 방식
     */
    @Bean
    public EgovCryptoService ariaCryptoService() {
        EgovARIACryptoServiceImpl cryptoService = new EgovARIACryptoServiceImpl();
        cryptoService.setPassword(cryptoKey);
        return cryptoService;
    }

    /**
     * 비밀번호 암호화 (단방향 - 복호화 불가)
     * - 개인정보보호법: 비밀번호 일방향 암호화 저장 의무
     * - BCrypt, PBKDF2, Argon2 등 사용 권장
     */
    @Bean
    public EgovPasswordEncoder egovPasswordEncoder() {
        return new EgovPasswordEncoder();
    }

    /**
     * 개인정보 마스킹 유틸리티
     * - 로그, 화면 출력 시 개인정보 마스킹 처리
     */
    @Bean
    public PersonalInfoMasker personalInfoMasker() {
        return new PersonalInfoMasker();
    }

    /**
     * 개인정보 마스킹 처리 클래스
     */
    public static class PersonalInfoMasker {

        /**
         * 주민등록번호 마스킹 (123456-1******)
         */
        public String maskResidentNumber(String residentNumber) {
            if (residentNumber == null || residentNumber.length() < 14) {
                return "******-*******";
            }
            return residentNumber.substring(0, 8) + "******";
        }

        /**
         * 이름 마스킹 (홍*동)
         */
        public String maskName(String name) {
            if (name == null || name.length() < 2) {
                return "*";
            }
            if (name.length() == 2) {
                return name.charAt(0) + "*";
            }
            return name.charAt(0) + "*".repeat(name.length() - 2) + name.charAt(name.length() - 1);
        }

        /**
         * 이메일 마스킹 (te***@example.com)
         */
        public String maskEmail(String email) {
            if (email == null || !email.contains("@")) {
                return "***@***.***";
            }
            String[] parts = email.split("@");
            String localPart = parts[0];
            if (localPart.length() <= 2) {
                return "**@" + parts[1];
            }
            return localPart.substring(0, 2) + "***@" + parts[1];
        }

        /**
         * 전화번호 마스킹 (010-****-5678)
         */
        public String maskPhoneNumber(String phoneNumber) {
            if (phoneNumber == null || phoneNumber.length() < 9) {
                return "***-****-****";
            }
            String cleaned = phoneNumber.replaceAll("-", "");
            if (cleaned.length() == 10) {
                return cleaned.substring(0, 3) + "-****-" + cleaned.substring(6);
            } else if (cleaned.length() == 11) {
                return cleaned.substring(0, 3) + "-****-" + cleaned.substring(7);
            }
            return "***-****-****";
        }

        /**
         * 카드번호 마스킹 (1234-****-****-5678)
         */
        public String maskCardNumber(String cardNumber) {
            if (cardNumber == null || cardNumber.length() < 16) {
                return "****-****-****-****";
            }
            String cleaned = cardNumber.replaceAll("-", "");
            return cleaned.substring(0, 4) + "-****-****-" + cleaned.substring(12);
        }
    }
}
