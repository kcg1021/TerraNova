변경 사항을 분석하고 Conventional Commits 규칙에 따라 커밋을 생성해줘.

## 절차

1. `git status`와 `git diff`로 변경 사항 확인
2. `git log --oneline -5`로 최근 커밋 스타일 참고
3. 변경 내용을 분석해서 적절한 type 선택:
   - `feat` : 새로운 기능 추가
   - `fix` : 버그 수정
   - `docs` : 문서 변경
   - `style` : 코드 포맷팅 (동작 변경 없음)
   - `refactor` : 리팩토링 (기능 변경 없음)
   - `test` : 테스트 추가/수정
   - `chore` : 빌드, 설정 파일, Docker, 의존성 변경
   - `ci` : CI/CD 설정 변경
   - `perf` : 성능 개선
4. 커밋 메시지 작성 규칙:
   - 형식: `<type>: <subject>`
   - subject는 한국어로 작성
   - subject는 50자 이내
   - subject 끝에 마침표 금지
   - 변경이 복잡한 경우 body에 이유 설명
5. 커밋 메시지를 작성하고 바로 커밋 실행
