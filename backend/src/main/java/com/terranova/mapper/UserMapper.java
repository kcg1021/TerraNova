package com.terranova.mapper;

import com.terranova.domain.user.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 사용자 Mapper (MyBatis - 복잡한 쿼리)
 * - 동적 쿼리
 * - 조인 쿼리
 * - 집계 쿼리
 */
@Mapper
public interface UserMapper {

    /**
     * 복잡한 조건으로 사용자 검색
     * @param params 검색 조건 (username, email, role, enabled, startDate, endDate)
     */
    List<User> searchUsers(Map<String, Object> params);

    /**
     * 사용자 통계 조회
     */
    Map<String, Object> getUserStatistics();

    /**
     * 역할별 사용자 수 조회
     */
    List<Map<String, Object>> countUsersByRole();

    /**
     * 최근 가입한 사용자 조회
     * @param limit 조회 개수
     */
    List<User> findRecentUsers(@Param("limit") int limit);

    /**
     * 비활성화된 사용자 목록 조회
     * @param days 비활성화된 일수
     */
    List<User> findInactiveUsers(@Param("days") int days);
}
