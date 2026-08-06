import type { Person } from "../../lib/schemas";

/**
 * 전역 가족 목록 — 여행별 participants에서 id로 참조.
 * (YAML 동등 데이터; 빌드 시 Node fs 없이 import 가능)
 */
export const people: Person[] = [
  {
    id: "dad",
    nameKo: "박성근",
    nameShort: "아빠",
    side: "nuclear",
    generation: "parent",
    isFocus: false,
  },
  {
    id: "mom",
    nameKo: "정하영",
    nameShort: "엄마",
    side: "nuclear",
    generation: "parent",
    isFocus: false,
  },
  {
    id: "sion",
    nameKo: "박시온",
    nameShort: "시온이",
    side: "nuclear",
    generation: "child",
    isFocus: true,
  },
  {
    id: "paternal-grandma",
    nameKo: "이귀분",
    nameShort: "친할머니",
    side: "paternal",
    generation: "grandparent",
    isFocus: false,
  },
  {
    id: "paternal-grandpa",
    nameKo: "박청구",
    nameShort: "친할아버지",
    side: "paternal",
    generation: "grandparent",
    isFocus: false,
  },
  {
    id: "maternal-grandma",
    nameKo: "하인숙",
    nameShort: "외할머니",
    side: "maternal",
    generation: "grandparent",
    isFocus: false,
  },
];
