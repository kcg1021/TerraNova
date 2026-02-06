plugins {
	java
	id("org.springframework.boot") version "3.5.6"
	id("io.spring.dependency-management") version "1.1.7"
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
	// 전자정부 프레임워크 5.0 Boot Starter
	implementation("org.egovframe.boot:egovframe-boot-starter-security:${egovVersion}")
	implementation("org.egovframe.boot:egovframe-boot-starter-crypto:${egovVersion}")
	implementation("org.egovframe.boot:egovframe-boot-starter-access:${egovVersion}")

	// 전자정부 프레임워크 5.0 실행환경
	implementation("org.egovframe.rte:egovframe-rte-fdl-cmmn:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-psl-dataaccess:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-property:${egovVersion}")
	implementation("org.egovframe.rte:egovframe-rte-fdl-idgnr:${egovVersion}")

	// Spring Boot Starters
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")

	// Database
	runtimeOnly("org.postgresql:postgresql")
	runtimeOnly("com.oracle.database.jdbc:ojdbc11")

	// Test
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
