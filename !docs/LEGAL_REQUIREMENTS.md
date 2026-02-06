# TerraNova 백엔드 - 전자정부 프레임워크 5.0 법적 필수 요구사항

## 개요

이 문서는 전자정부 프레임워크 5.0을 사용하는 정부 사업 프로젝트에서 **법적으로 필수**로 적용해야 하는 공통 컴포넌트 및 보안 요구사항을 정리합니다.

---

## 1. 법적 근거

### 1.1 개인정보보호법

| 조항 | 내용 | 필수 조치 |
|------|------|-----------|
| **제24조** | 고유식별정보 처리 제한 | 암호화 저장 |
| **제24조의2** | 주민등록번호 처리 제한 | ARIA 암호화 필수 |
| **제29조** | 안전조치 의무 | 접속기록 보관, 암호화 |

### 1.2 개인정보의 안전성 확보조치 기준 (2025.10.31 개정)

#### 접근 권한 관리
- 개인정보처리시스템에 대한 접근 권한을 최소한의 범위로 차등 부여
- 권한 부여/변경/말소 내역 기록 및 **3년 보관**

#### 접속기록 보관
| 조건 | 보관 기간 |
|------|-----------|
| 일반 | 1년 이상 |
| 5만명 이상 정보주체 | **2년 이상** |
| 고유식별정보(주민번호) 처리 | **2년 이상** |
| 민감정보 처리 | **2년 이상** |

#### 암호화 조치
| 대상 | 암호화 방식 |
|------|-------------|
| 주민등록번호, 카드번호 | 양방향 암호화 (ARIA 권장) |
| 비밀번호 | 단방향 암호화 (BCrypt, Argon2) |
| 네트워크 전송 | HTTPS (TLS 1.2+) |

---

## 2. 전자정부 프레임워크 5.0 필수 의존성

### 2.1 Boot Starter (법적 필수)

```kotlin
// Security: 인증/인가/접근제어
implementation("org.egovframe.boot:egovframe-boot-starter-security:5.0.0")

// Crypto: ARIA 암호화/복호화
implementation("org.egovframe.boot:egovframe-boot-starter-crypto:5.0.0")

// Access: 세션 기반 접근제어
implementation("org.egovframe.boot:egovframe-boot-starter-access:5.0.0")
```

### 2.2 실행환경 - Foundation Layer (FDL)

```kotlin
// 공통 기능
implementation("org.egovframe.rte:egovframe-rte-fdl-cmmn:5.0.0")

// 암호화 (ARIA)
implementation("org.egovframe.rte:egovframe-rte-fdl-crypto:5.0.0")

// ID 생성 (UUID, Sequence)
implementation("org.egovframe.rte:egovframe-rte-fdl-idgnr:5.0.0")

// 로깅 (접속기록)
implementation("org.egovframe.rte:egovframe-rte-fdl-logging:5.0.0")

// 프로퍼티 관리
implementation("org.egovframe.rte:egovframe-rte-fdl-property:5.0.0")
```

### 2.3 실행환경 - Persistence Layer (PSL)

```kotlin
// MyBatis 지원 (복잡한 쿼리)
implementation("org.egovframe.rte:egovframe-rte-psl-dataaccess:5.0.0")

// JPA 지원 (간단한 CRUD)
implementation("org.egovframe.rte:egovframe-rte-psl-data-jpa:5.0.0")
```

---

## 3. 필수 구현 사항

### 3.1 보안 (Security)

**파일**: `EgovSecurityConfig.java`

| 기능 | 법적 근거 | 상태 |
|------|-----------|:----:|
| 인증/인가 설정 | 개인정보보호법 제29조 | ✅ |
| CSRF 보호 | OWASP Top 10 | ✅ |
| 세션 관리 (동시 접속 1개) | 안전성 확보조치 기준 | ✅ |
| 비밀번호 BCrypt 암호화 | 개인정보보호법 제24조 | ✅ |

### 3.2 암호화 (Crypto)

**파일**: `EgovCryptoConfig.java`

| 기능 | 법적 근거 | 상태 |
|------|-----------|:----:|
| ARIA 암호화 서비스 | 개인정보보호법 제24조의2 | ✅ |
| 비밀번호 단방향 암호화 | 개인정보보호법 제24조 | ✅ |
| 개인정보 마스킹 | 안전성 확보조치 기준 | ✅ |

#### 마스킹 규칙
| 항목 | 예시 |
|------|------|
| 주민등록번호 | `123456-1******` |
| 이름 | `홍*동` |
| 이메일 | `te***@example.com` |
| 전화번호 | `010-****-5678` |
| 카드번호 | `1234-****-****-5678` |

### 3.3 접속기록 (Access Log)

**파일**: `AccessLog.java`, `AccessLogService.java`

| 기록 항목 | 법적 필수 | 상태 |
|-----------|:---------:|:----:|
| 사용자 식별자 (username) | ✅ | ✅ |
| 접속일시 (accessTime) | ✅ | ✅ |
| 접속지 정보 (IP주소) | ✅ | ✅ |
| 처리한 업무 (processedWork) | ✅ | ✅ |
| 처리 결과 | 권장 | ✅ |

**보관기간**: 2년 (고유식별정보 처리 시스템)

### 3.4 감사 (Audit)

**파일**: `EgovAuditConfig.java`, `BaseEntity.java`

| 기능 | 상태 |
|------|:----:|
| 생성자/수정자 자동 기록 | ✅ |
| 생성일시/수정일시 자동 기록 | ✅ |
| 모든 엔티티 BaseEntity 상속 | ✅ |

### 3.5 로깅 (Logging)

**파일**: `LoggingAspect.java`

| 기능 | 상태 |
|------|:----:|
| Controller 접근 로깅 | ✅ |
| 데이터 변경 작업 로깅 | ✅ |
| 사용자/IP/처리내역 기록 | ✅ |

### 3.6 배치 작업 (Batch)

**파일**: `AccessLogScheduler.java`

| 기능 | 상태 |
|------|:----:|
| 만료 접속기록 자동 삭제 (2년 후) | ✅ |
| 매일 새벽 2시 실행 | ✅ |

---

## 4. application.yml 필수 설정

```yaml
spring:
  # 암호화 설정 (법적 필수)
  crypto:
    enabled: true
    algorithm: AES
    key: ${EGOV_CRYPTO_KEY}  # 환경변수로 관리 필수!

server:
  servlet:
    session:
      timeout: 30m
      cookie:
        http-only: true  # XSS 방지
        secure: true     # HTTPS만 전송

logging:
  file:
    max-history: 730  # 2년 보관

egov:
  crypto:
    key: ${EGOV_CRYPTO_KEY}
    initial-vector: ${EGOV_CRYPTO_IV}
  access-log:
    retention-years: 2  # 2년 보관
```

---

## 5. 데이터베이스 스키마

### 접속기록 테이블 (tb_access_log)

```sql
CREATE TABLE tb_access_log (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,        -- 사용자ID (필수)
    access_time TIMESTAMP NOT NULL,        -- 접속일시 (필수)
    ip_address VARCHAR(45) NOT NULL,       -- IP주소 (필수)
    request_uri VARCHAR(500),
    http_method VARCHAR(10),
    processed_work VARCHAR(200),           -- 처리업무 (필수)
    result VARCHAR(20),
    error_message VARCHAR(1000),
    user_agent VARCHAR(500),
    session_id VARCHAR(100),
    execution_time BIGINT,
    created_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_at TIMESTAMP,
    updated_by VARCHAR(100)
);

-- 인덱스
CREATE INDEX idx_username_access_time ON tb_access_log(username, access_time);
CREATE INDEX idx_access_time ON tb_access_log(access_time);
```

---

## 6. 개인정보 처리 예시

### 6.1 암호화 저장

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final EgovCryptoService ariaCryptoService;

    public void saveUser(UserDto dto) {
        // 주민등록번호 암호화 (법적 필수)
        String encrypted = ariaCryptoService.encrypt(dto.getResidentNumber());
        user.setResidentNumber(encrypted);
        userRepository.save(user);
    }
}
```

### 6.2 마스킹 처리

```java
// 로그 출력 시
String masked = personalInfoMasker.maskResidentNumber(residentNumber);
log.info("사용자 조회: {}", masked);  // 123456-1******

// API 응답 시
return UserResponse.builder()
    .residentNumber(personalInfoMasker.maskResidentNumber(decrypted))
    .build();
```

---

## 7. 점검 체크리스트

### 보안 (Security)
- [x] Spring Security 6.x 설정
- [x] 비밀번호 BCrypt 암호화
- [x] CSRF 보호 활성화
- [x] 세션 타임아웃 30분
- [x] 동시 세션 1개 제한

### 암호화 (Crypto)
- [x] ARIA 암호화 서비스 설정
- [x] 개인정보 마스킹 유틸리티
- [ ] 암호화 키 환경변수 관리 (운영 시)

### 접속기록 (Access Log)
- [x] 접속기록 엔티티
- [x] 비동기 저장 서비스
- [x] 2년 보관 설정
- [x] 만료 로그 자동 삭제

### 감사 (Audit)
- [x] JPA Auditing 설정
- [x] BaseEntity 생성
- [x] 모든 엔티티 상속

### 로깅 (Logging)
- [x] LoggingAspect 설정
- [x] Controller 접근 로깅
- [x] 데이터 변경 로깅

---

## 8. 주의사항

### 개인정보 처리 금지 사항

```java
// ❌ 평문 로깅 금지
log.info("주민번호: {}", user.getResidentNumber());

// ❌ 평문 DB 저장 금지
user.setResidentNumber(dto.getResidentNumber());

// ❌ 평문 API 응답 금지
return new UserDto(user.getResidentNumber());
```

### 올바른 처리 방법

```java
// ✅ 마스킹 후 로깅
log.info("주민번호: {}", masker.maskResidentNumber(residentNumber));

// ✅ 암호화 후 저장
user.setResidentNumber(cryptoService.encrypt(residentNumber));

// ✅ 마스킹 후 응답
return new UserDto(masker.maskResidentNumber(decrypted));
```

---

## 9. 참고 자료

### 법령
- [개인정보보호법](https://www.law.go.kr)
- [개인정보의 안전성 확보조치 기준](https://www.pipc.go.kr)

### 전자정부 프레임워크
- [공식 포털](https://www.egovframe.go.kr)
- [Maven 저장소](https://maven.egovframe.go.kr/maven/)
- [GitHub](https://github.com/eGovFramework)

### 기술 문서
- [Spring Security 6.x](https://docs.spring.io/spring-security/reference/)
- [ARIA 암호화](https://seed.kisa.or.kr/kisa/algorithm/EgovAriaInfo.do)

---

**작성일**: 2026-02-06
**버전**: 1.0
**전자정부 프레임워크**: 5.0.0 beta
