package com.terranova.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/**
 * 전자정부 프레임워크 5.0 MyBatis 설정
 * - 복잡한 쿼리 및 동적 SQL 처리
 * - JPA와 병행 사용
 */
@Configuration
@MapperScan(basePackages = "com.terranova.mapper", sqlSessionFactoryRef = "sqlSessionFactory")
public class EgovMyBatisConfig {

    /**
     * MyBatis SqlSessionFactory 설정
     */
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        
        // Mapper XML 위치 설정
        sessionFactory.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:mapper/**/*.xml")
        );
        
        // Type Aliases 패키지 설정
        sessionFactory.setTypeAliasesPackage("com.terranova.domain");
        
        // MyBatis 설정
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true); // snake_case to camelCase 자동 변환
        configuration.setDefaultFetchSize(100);
        configuration.setDefaultStatementTimeout(30);
        configuration.setCacheEnabled(true); // 2차 캐시 활성화
        configuration.setLazyLoadingEnabled(true); // 지연 로딩 활성화
        
        sessionFactory.setConfiguration(configuration);
        
        return sessionFactory.getObject();
    }

    /**
     * MyBatis SqlSessionTemplate 설정
     * - Thread-safe한 SqlSession 구현체
     */
    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
