# TerraNova 프로젝트 구조

## 개요

TerraNova는 Frontend(React)와 Backend(Spring Boot)로 구성된 풀스택 웹 애플리케이션입니다.

## 디렉토리 구조

```
TerraNova/
├── .claude/                          # Claude Code 설정
│   ├── agents/                       # 에이전트 설정
│   │   └── commit.md
│   ├── commands/                     # 커스텀 명령어
│   │   └── commit.md
│   └── settings.local.json
│
├── backend/                          # Spring Boot 백엔드
│   ├── gradle/wrapper/               # Gradle Wrapper
│   │   └── gradle-wrapper.properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/terranova/
│   │   │   │   └── TerranovaBackendApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-postgresql.yml
│   │   │       └── application-oracle.yml
│   │   └── test/
│   │       └── java/com/terranova/
│   │           └── TerranovaBackendApplicationTests.java
│   ├── build.gradle.kts              # Gradle 빌드 설정
│   ├── settings.gradle.kts
│   ├── gradlew                       # Unix용 Gradle Wrapper
│   ├── gradlew.bat                   # Windows용 Gradle Wrapper
│   └── Dockerfile
│
├── frontend/                         # React + Vite 프론트엔드
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.tsx                   # 메인 App 컴포넌트
│   │   ├── index.css                 # 글로벌 스타일
│   │   └── main.tsx                  # 엔트리 포인트
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json                 # TypeScript 설정
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts                # Vite 설정
│   ├── eslint.config.js              # ESLint 설정
│   ├── nginx.conf                    # Nginx 설정 (배포용)
│   └── Dockerfile
│
├── docs/                             # 문서
│   └── PROJECT_STRUCTURE.md
│
├── .env.example                      # 환경변수 예시
├── .gitignore
├── docker-compose.yml                # PostgreSQL Docker Compose
├── docker-compose.oracle.yml         # Oracle Docker Compose
└── LICENSE
```

## 기술 스택

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS

### Backend
- **Framework**: Spring Boot 3.5
- **Language**: Java 21
- **Build Tool**: Gradle (Kotlin DSL)

### Database
- PostgreSQL (기본)
- Oracle (선택적)

### 인프라
- Docker / Docker Compose
- Nginx (프론트엔드 서빙)

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
