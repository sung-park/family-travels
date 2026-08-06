# family-travels

시온이 중심 **다세대 가족 여행** 일정·숙소·교통 공유 사이트입니다.

- **첫 여행:** 2026-09-03 ~ 2026-09-09, 베트남 나트랑  
- **라이브:** [https://sung-park.github.io/family-travels/](https://sung-park.github.io/family-travels/)  
- **호스팅:** GitHub Pages (project site, `base: /family-travels/`)  
- **설계 문서:** [docs/design-family-travels.md](./docs/design-family-travels.md)

## 개발

```bash
npm install
npm run dev
```

로컬에서는 보통 `http://localhost:4321/family-travels/` 로 열립니다 (`base` 경로 포함).

```bash
npm run build   # 정적 산출물 → dist/
npm run preview # 빌드 결과 미리보기
npm run check   # Astro 타입 체크
```

## 배포

`main` 브랜치에 push하면 [GitHub Actions](.github/workflows/deploy-pages.yml)가 `dist/`를 **`gh-pages` 브랜치**에 올리고, GitHub Pages가 그 브랜치를 서빙합니다.

1. 저장소 **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`gh-pages`** / **`/` (root)**
2. `main`에 push 또는 Actions에서 **Deploy to GitHub Pages** 수동 실행
3. 라이브: https://sung-park.github.io/family-travels/

수용 기준: 라이브 URL **HTTP 200**, CSS 로드. 카톡 미리보기는 콘텐츠 추가 후 재확인.

> 참고: 공식 `actions/deploy-pages` 경로가 `deployment_in_progress`에 걸리는 경우가 있어, 브랜치 배포로 우회합니다.

## 콘텐츠 규칙 (요약)

| 공개 OK | 올리지 말 것 |
|---------|----------------|
| 일정, 숙소 이름, 공개 링크 | 예약번호, PNR, 여권, 보험증권 원본 |

민감 정보는 로컬 전용 파일만 사용합니다.

```
**/*.private.local.yaml   # .gitignore 됨 — 커밋 금지
```

예시 파일은 이후 `_template` 과 함께 추가됩니다.

## 스택

- [Astro](https://astro.build) SSG  
- [Tailwind CSS](https://tailwindcss.com) v4  
- GitHub Actions → GitHub Pages

## 이름 표기

사이트에는 시온이 **애칭만** 사용합니다. 미정 항목은 `(TBD)` 로 표시합니다.
