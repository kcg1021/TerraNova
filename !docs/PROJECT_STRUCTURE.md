# TerraNova 프로젝트 구조

## 개요

TerraNova는 **전자정부 프레임워크 5.0** 기반의 Frontend(React)와 Backend(Spring Boot)로 구성된 풀스택 웹 애플리케이션입니다.

## 디렉토리 구조

```
TerraNova/
├── .claude/                              # Claude Code 설정
│   ├── agents/                           # 서브에이전트 정의
│   │   ├── commit.md                     # 커밋 에이전트
│   │   ├── egovframe.md                  # 전자정부 프레임워크 에이전트
│   │   └── build.md                      # 빌드/보안검사 에이전트
│   ├── commands/                         # 커스텀 명령어
│   │   └── commit.md
│   └── settings.local.json
│
├── !docs/                                # 프로젝트 문서
│   ├── PROJECT_STRUCTURE.md              # 프로젝트 구조 (현재 파일)
│   └── LEGAL_REQUIREMENTS.md             # 법적 필수 요구사항
│
├── backend/                              # Spring Boot 백엔드
│   ├── gradle/wrapper/
│   │   └── gradle-wrapper.properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/terranova/
│   │   │   │   ├── aspect/               # AOP
│   │   │   │   │   └── LoggingAspect.java
│   │   │   │   ├── common/               # 공통 클래스
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   └── BaseEntity.java
│   │   │   │   ├── config/               # 설정 클래스
│   │   │   │   │   ├── EgovAuditConfig.java
│   │   │   │   │   ├── EgovBatchConfig.java
│   │   │   │   │   ├── EgovCryptoConfig.java
│   │   │   │   │   ├── EgovIdGenerationConfig.java
│   │   │   │   │   ├── EgovMyBatisConfig.java
│   │   │   │   │   └── EgovSecurityConfig.java
│   │   │   │   ├── controller/           # REST 컨트롤러
│   │   │   │   │   └── HealthController.java
│   │   │   │   ├── domain/               # 도메인 (엔티티, Repository)
│   │   │   │   │   ├── audit/
│   │   │   │   │   │   ├── AccessLog.java
│   │   │   │   │   │   └── AccessLogRepository.java
│   │   │   │   │   └── user/
│   │   │   │   │       ├── User.java
│   │   │   │   │       ├── UserRepository.java
│   │   │   │   │       └── UserRole.java
│   │   │   │   ├── mapper/               # MyBatis Mapper 인터페이스
│   │   │   │   │   └── UserMapper.java
│   │   │   │   ├── service/              # 서비스 레이어
│   │   │   │   │   └── AccessLogService.java
│   │   │   │   └── TerranovaBackendApplication.java
│   │   │   └── resources/
│   │   │       ├── mapper/               # MyBatis XML 매퍼
│   │   │       │   └── UserMapper.xml
│   │   │       ├── application.yml
│   │   │       ├── application-postgresql.yml
│   │   │       └── application-oracle.yml
│   │   └── test/
│   │       └── java/com/terranova/
│   │           └── TerranovaBackendApplicationTests.java
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   ├── gradlew / gradlew.bat
│   └── Dockerfile
│
├── frontend/                             # React + Vite 프론트엔드
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── nginx.conf
│   └── Dockerfile
│
├── .env.example
├── .gitignore
├── CLAUDE.md                             # Claude 사용 지침
├── docker-compose.yml                    # PostgreSQL
├── docker-compose.oracle.yml             # Oracle
└── LICENSE
```

## 기술 스택

### Frontend
| 항목 | 기술 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Language | TypeScript 5.9 |
| Styling | TailwindCSS 4 |

### Backend
| 항목 | 기술 |
|------|------|
| Framework | Spring Boot 3.5.6 |
| Language | Java 21 |
| Build Tool | Gradle (Kotlin DSL) |
| 표준 프레임워크 | 전자정부 프레임워크 5.0 |

### Database
| DB | 용도 |
|----|------|
| PostgreSQL | 기본 |
| Oracle | 선택적 |

### ORM
| 기술 | 용도 |
|------|------|
| JPA | 간단한 CRUD |
| MyBatis | 복잡한 쿼리 |

### 인프라
- Docker / Docker Compose
- Nginx (프론트엔드 서빙)

## 전자정부 프레임워크 5.0 구성

### Boot Starter (법적 필수)
- `egovframe-boot-starter-security` - 보안/인증
- `egovframe-boot-starter-crypto` - 암호화
- `egovframe-boot-starter-access` - 접근제어

### 실행환경 (RTE)
- `egovframe-rte-fdl-cmmn` - 공통 기능
- `egovframe-rte-fdl-crypto` - ARIA 암호화
- `egovframe-rte-fdl-idgnr` - ID 생성
- `egovframe-rte-fdl-logging` - 로깅
- `egovframe-rte-fdl-property` - 프로퍼티
- `egovframe-rte-psl-dataaccess` - MyBatis
- `egovframe-rte-psl-data-jpa` - JPA

## 실행 방법

### 개발 환경

1. **환경 변수 설정**
   ```bash
   cp .env.example .env
   # .env 파일 수정
   ```

2. **데이터베이스 실행**
   ```bash
   # PostgreSQL
   docker-compose up -d

   # 또는 Oracle
   docker-compose -f docker-compose.oracle.yml up -d
   ```

3. **백엔드 실행**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

4. **프론트엔드 실행**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 빌드 및 검사

```bash
# 프론트엔드
cd frontend
npm run build        # 빌드
npm run type-check   # 타입 검사
npm audit            # 보안 검사

# 백엔드
cd backend
./gradlew build                      # 빌드 + 테스트
./gradlew dependencyCheckAnalyze     # OWASP 보안 검사
```

## 서브에이전트

| 에이전트 | 용도 | 호출 |
|----------|------|------|
| commit | Git 커밋 | `@commit` 또는 `/commit` |
| egovframe | 전자정부 컴포넌트 조사/적용 | `@egovframe` |
| build | 빌드 및 보안 검사 | `@build` |
