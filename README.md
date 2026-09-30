# DevSnip

React + TypeScript + JavaScript 실무 스니펫을 빠르게 검색하고 복사하는 원클릭 코드 치트시트입니다.

**라이브 데모:** https://minkkaeng.github.io/devsnip/

개발 중 문법과 타입 선언을 다시 찾아야 할 때, 스택과 카테고리를 고르고 예제·주의점을 한 화면에서 확인한 뒤 필요한 언어의 코드만 복사할 수 있도록 만들었습니다.

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
npm run format:check # 포맷 확인
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

| 키                | 동작                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| Ctrl+K / ⌘K       | 현재 스택 검색창 포커스, 기존 검색어 선택                             |
| ↑ / ↓             | 검색창·목록에서 항목 탐색                                             |
| Tab               | 검색창·목록·코드에서 첫 번은 JS ↔ TS 전환, 연속 두 번째는 포커스 이동 |
| Enter             | 검색창·목록·코드에서 현재 언어의 코드 복사                            |
| Shift+Tab         | 기본 역방향 포커스 이동                                               |
| Space             | 목록 버튼 활성화, 모바일 상세 열기                                    |
| Escape            | 검색어 초기화 / 빈 검색창 포커스 해제 / Drawer 닫기                   |
| ← / →, Home / End | 코드 언어 탭에서 탭 선택                                              |

일반 버튼·링크·메뉴에서는 기본 키보드 동작을 유지합니다. TS 전용 타입 선언은 JS 탭을 비활성화하며 Tab이 기본 포커스 이동으로 동작합니다. 다른 키를 누르거나 포커스를 옮긴 뒤에는 첫 Tab부터 다시 언어를 전환합니다. 한글 IME 조합 중 단축키는 실행하지 않습니다.

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

## 설계 선택

- 정적 JSON 3개를 데이터 소스로 사용합니다. 관리자가 한 명이고 콘텐츠 업데이트에 배포가 허용되는 현재 범위에서는 DB·관리자 화면보다 검증과 유지보수가 단순합니다.
- 검색·필터·선택을 Zustand로 동기화하고, Fuse.js 인덱스는 스택별로 생성합니다. 검색 결과가 없으면 이전 선택과 복사 대상도 함께 제거합니다.
- 클립보드 권한 거부 시 브라우저 복사 fallback을 시도하고 실패를 별도로 안내합니다. 코드 하이라이팅은 HTML을 삽입하지 않고 React 텍스트 노드로 렌더링합니다.
- `Tab` 첫 입력을 언어 전환에 쓰는 대신 연속 두 번째 입력은 기본 포커스 이동으로 돌려줍니다. 이 단축키 흐름은 실제 브라우저에서 추가 검수가 필요합니다.

## 검증과 다음 작업

[개발 체크리스트](docs/checklist.md)와 [수동 QA 절차](docs/qa.md)를 참고하세요. 자동 테스트 23개는 jsdom과 TypeScript 컴파일러를 사용합니다. 실제 브라우저·실기기 레이아웃과 클립보드 검수는 별도로 필요합니다.

GitHub Actions가 포맷·린트·테스트·빌드를 통과한 `dist`를 GitHub Pages에 배포합니다. 공개 URL에서 HTML·JS·CSS·파비콘의 HTTPS 응답을 확인했습니다. 공유용 OG PNG 이미지와 실브라우저 QA는 아직 남아 있습니다.
