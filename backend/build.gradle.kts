plugins {
	java
	id("org.springframework.boot") version "3.5.6"
	id("io.spring.dependency-management") version "1.1.7"
	id("org.owasp.dependencycheck") version "12.1.0" // 보안 취약점 검사
}

group = "com.terranova"
version = "0.0.1-SNAPSHOT"
description = "TerraNova Backend - 전자정부 프레임워크 5.0 기반"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	maven { url = uri("https://maven.egovframe.go.kr/maven/") }
	mavenCentral()
}

// 전자정부 프레임워크 5.0 버전 관리
val egovVersion = "5.0.0"

dependencies {
	// 전자정부 프레임워크 5.0 Boot Starter (법적 필수)
	implementation("org.egovframe.boot:egovframe-boot-starter-security:${egovVersion}")
	implementation("org.egovframe.boot:egovframe-boot-starter-crypto:${egovVersion}")
	implementation("org.egovframe.boot:egovframe-boot-starter-access:${egovVersion}")

	// 전자정부 프레임워크 5.0 실행환경 (FDL - Foundation Layer)
	implementation("org.egovframe.rte:egovframe-rte-fdl-cmmn:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-property:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-idgnr:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-crypto:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-logging:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-excel:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-string:${egovVersion}")

	// 전자정부 프레임워크 5.0 실행환경 (PSL - Persistence Layer)
	implementation("org.egovframe.rte:egovframe-rte-psl-dataaccess:${egovVersion}") // MyBatis 지원
	implementation("org.egovframe.rte:egovframe-rte-psl-data-jpa:${egovVersion}") // JPA 지원

	// Spring Boot Starters
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-aop")

	// MyBatis Spring Boot Starter
	implementation("org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.4")

	// Database
	runtimeOnly("org.postgresql:postgresql")
	runtimeOnly("com.oracle.database.jdbc:ojdbc11")

	// Lombok (보일러플레이트 코드 감소)
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// Test
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

// OWASP Dependency Check 설정
dependencyCheck {
	// NVD API Key (선택사항 - 속도 향상)
	// nvd.apiKey = System.getenv("NVD_API_KEY") ?: ""

	// 분석할 설정
	analyzers.assemblyEnabled = false

	// 실패 기준 (CVSS 7.0 이상이면 빌드 실패)
	failBuildOnCVSS = 7.0f

	// 보고서 형식
	formats = listOf("HTML", "JSON")

	// 보고서 출력 경로
	outputDirectory = layout.buildDirectory.dir("reports/dependency-check").get().asFile.absolutePath
}
