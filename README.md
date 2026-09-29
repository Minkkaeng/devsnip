# DevSnip

React + TypeScript + JavaScript 실무 스니펫을 빠르게 검색하고 복사하는 원클릭 코드 치트시트입니다.

## 실행

Node.js 22.12 이상 또는 24 LTS 환경을 사용하세요.

```sh
npm install
npm run dev
```

터미널에 표시되는 localhost 주소에서 확인할 수 있습니다.

```sh
npm run test    # 검색·상태·사용자 흐름·클립보드·스니펫 코드 검사
npm run lint    # 코드 정적 검사
npm run build   # 타입 검사 후 dist 생성
npm run preview # 빌드 결과 확인
npm run format # 코드·문서 포맷 정리
```

## 구현된 기능

- 스택 & 카테고리 → 목록 → 상세의 데스크톱 3단 레이아웃
- 모바일 Drawer와 목록/상세 화면 전환
- 21개 스니펫: React 8개 / TypeScript 7개 / JavaScript 6개
- title, summary, tags 퍼지 검색과 카테고리 필터
- JS / TS 전환, JSX / TSX 포함 코드 하이라이팅
- 원클릭 복사, 성공/실패 토스트, 실무 Gotcha 아코디언
- 결과 없음 처리와 필터·선택 항목 동기화
- 키보드 조작과 reduced-motion 대응

## 키보드

| 키 | 동작 |
| --- | --- |
| Ctrl+K / ⌘K | 현재 스택 검색창 포커스, 기존 검색어 선택 |
| ↑ / ↓ | 검색창·목록에서 항목 탐색 |
| Tab | 검색창·목록·코드에서 JS ↔ TS 전환 |
| Enter | 검색창·목록·코드에서 현재 언어의 코드 복사 |
| Shift+Tab | 기본 역방향 포커스 이동 |
| Space | 목록 버튼 활성화, 모바일 상세 열기 |
| Escape | 검색어 초기화 / 빈 검색창 포커스 해제 / Drawer 닫기 |
| ← / →, Home / End | 코드 언어 탭에서 탭 선택 |

일반 버튼·링크·메뉴에서는 기본 키보드 동작을 유지합니다. TS 전용 타입 선언은 JS 탭을 비활성화하며 Tab이 기본 포커스 이동으로 동작합니다. 한글 IME 조합 중 단축키는 실행하지 않습니다.

## 구조

```text
src/
├─ components/  Header, StackSidebar, ItemList, DetailView, CodeBlock, Toast
├─ data/        react.json, typescript.json, javascript.json
├─ hooks/       useKeyboardShortcut, useCopyCode
├─ lib/         fuse, selection, clipboard
├─ store/       useSnipStore
└─ types/       SnipItem, TechStack, Gotcha, StackId, CodeTab
```

타입 계약은 src/types/snip.ts에 있습니다. 새로운 스니펫은 해당 스택 JSON에 고유 ID, 카테고리, 제목, 설명, 태그, 코드, 주의점, 공식 문서 URL을 추가합니다. TS 코드가 필수이며 JS 코드는 생략할 수 있습니다. React 이벤트 예제는 설치된 React 19.2 타입 기준입니다.

검색은 현재 스택과 선택한 카테고리 안에서 수행합니다. [Fuse.js](https://www.fusejs.io/fuzzy-search.html)의 threshold는 0.35, 제목/태그/설명 가중치는 0.6/0.25/0.15입니다. 인덱스는 스택별로 한 번 생성합니다.

## 검증과 다음 작업

[개발 체크리스트](docs/checklist.md)와 [수동 QA 절차](docs/qa.md)를 참고하세요. 자동 테스트는 jsdom과 TypeScript 컴파일러를 사용합니다. 실제 브라우저·실기기 레이아웃과 클립보드 검수는 별도로 필요합니다.

정적 배포는 빌드 명령 npm run build, 출력 폴더 dist를 사용합니다. 공유 PNG 이미지, canonical/og:url, 배포·도메인·HTTPS 확인은 아직 남아 있습니다.
