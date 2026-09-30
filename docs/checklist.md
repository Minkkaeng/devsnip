# DevSnip 개발 체크리스트

실제 소스 코드 기준으로 정리한 진행 상태입니다. 구현과 실브라우저 검증은 별도로 표시합니다.

## Phase 1. 기획과 데이터 계약

- [x] 서비스명, 목적, 대상 사용자, MVP 범위 정의
- [x] `SnipItem`, `TechStack`, `Gotcha`, 스택 ID와 코드 언어 타입 정의
- [x] 검색 범위: 현재 스택 안에서 title / summary / tags 검색, 카테고리와 교차 필터
- [x] 화면 전체 스크롤을 제한하고 긴 목록·코드는 패널 안에서 스크롤
- [x] TS 전용 타입 선언은 JS 탭 비활성화

## Phase 2. 개발 환경과 구조

- [x] Vite + React + TypeScript
- [x] TypeScript strict 모드 및 JSON 모듈 설정
- [x] Tailwind CSS v4의 CSS import와 Vite 플러그인 연결
- [x] Zustand, Fuse.js, Framer Motion, Lucide React, Prism.js 연결
- [x] components / data / hooks / lib / store / types 분리
- [x] Windows 폴더 대소문자 충돌 해결: `src/components`

## Phase 3. MVP 핵심 기능

- [x] 스택·카테고리·검색·선택·코드 언어·모바일 화면 전역 상태 관리
- [x] Header / StackSidebar / ItemList / DetailView 통합
- [x] Fuse.js 검색: threshold 0.35, 위치 제한 해제, 제목 우선 가중치
- [x] 필터 변경 후 선택 동기화 및 검색 결과 없음 상태
- [x] JS ↔ TS 전환 및 원클릭 복사
- [x] Clipboard API + fallback + 실패 안내
- [x] Gotcha 아코디언과 공식 문서 링크
- [x] Ctrl+K / ⌘K 검색 포커스
- [x] 검색·목록의 ↑ / ↓ 탐색
- [x] 검색·목록·코드의 첫 Tab 언어 전환, 연속 두 번째 Tab 기본 포커스 이동, Enter 복사
- [x] Shift+Tab 기본 포커스 이동, 검색의 Escape 초기화
- [x] 한글 IME 조합 중 단축키 오작동 방지
- [x] React 데이터 8개: 상태·ref·effect·callback·memo·reducer·context·이벤트
- [x] TypeScript 데이터 7개: Generic·Utility Types·Record·Union·Guard·satisfies·Event types
- [x] JavaScript 데이터 6개: 배열·구조 분해·Promise·optional chaining·불변 업데이트·debounce

## Phase 4. UI/UX 구현

- [x] Prism 기반 JS / TS / JSX / TSX 하이라이팅과 줄 번호
- [x] React 텍스트 노드로 토큰 렌더링: 스니펫 HTML 실행 방지
- [x] 선택 인디케이터, 코드 탭 인디케이터, 복사 토스트 애니메이션
- [x] 사용자 reduced-motion 설정 대응
- [x] 데스크톱 3단 레이아웃
- [x] 900px 이하 Drawer 메뉴 및 목록/상세 전환
- [x] 작은 모바일 검색창, 코드 가로 스크롤
- [x] 언어 탭 ARIA / 방향키 조작 / skip link / 결과·복사 상태 알림
- [x] 모바일 목록·상세 전환 시 포커스 이동
- [ ] 실브라우저에서 레이아웃과 애니메이션 시각 검수

## Phase 5. 자동 검증과 수동 QA

- [x] Vitest + Testing Library 자동 검증 구성
- [x] 데이터 필수 필드·고유 ID·공식 문서 주소 검사
- [x] 정확한 검색·오타·한국어 설명·태그·빈 결과 검사
- [x] 상태 동기화·이동 경계·TS 전용 항목 검사
- [x] 검색 → 방향키 → 탭 전환 → 코드 복사 사용자 흐름 검사

- [x] 연속 Tab 언어 전환 후 기본 포커스 이동 회귀 검사
- [x] 클립보드 성공·거부 fallback·실패·포커스 복원 검사
- [x] 코드 하이라이팅·IME·메뉴 열기/닫기 검사
- [x] 모든 TS 예제 strict 타입 검사 / JS 예제 구문 검사
- [ ] Chrome / Safari / Firefox 실제 클립보드 및 키보드 동작 확인
- [ ] 1440px / 1024px / 768px / 390px / 320px 뷰포트 검수
- [ ] iOS Safari / Android Chrome 실기기 확인

자동 검증은 jsdom 및 TypeScript 컴파일러 기준입니다. 연결된 브라우저가 없어 실브라우저와 실기기 검증은 수행하지 않았습니다.

## Phase 6. 배포와 운영

- [x] 한국어 문서 언어, 제목·description·theme-color·기본 OG/Twitter 텍스트 메타 태그
- [x] DevSnip favicon
- [ ] 공유용 OG PNG 이미지와 og:image 설정
- [ ] 배포 주소 확정 후 canonical / og:url 추가
- [ ] Vercel 또는 Cloudflare Pages 배포: 빌드 `npm run build`, 출력 `dist`
- [ ] 도메인 연결 / HTTPS / 배포 환경 클립보드 확인
- [ ] 분석 도구 도입 여부 결정

## 다음 진행 순서

1. 로컬 화면을 열어 데스크톱·모바일 UI 검수
2. 실제 브라우저의 키보드 조작·복사·포커스 QA
3. 공유 이미지와 배포 도메인 메타 태그 완성
4. 정적 호스팅 배포 후 HTTPS와 전체 흐름 확인
