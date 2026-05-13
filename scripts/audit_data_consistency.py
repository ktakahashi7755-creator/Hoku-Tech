#!/usr/bin/env python3
"""
audit_data_consistency.py — Hoku Tech data/*.js 整合性検査

Python 標準ライブラリのみで `data/*.js` を解析し、以下 5 項目を検査する。

  [1] chapters.js の各 chapter.lessons[] が lesson-pXX.js に存在するか
  [2] lesson-pXX.js の各 nextLesson が実在 Lesson を指すか (null は許容)
  [3] lesson-pXX.js に定義されているが chapter.lessons[] に含まれていない
      孤立 Lesson が無いか
  [4] assignments.js の全 13 件に
      optionalFeatures / readmeChecklist / instructorCheckPoints / scoringRubric
      が存在するか
  [5] assignments.js の hokiLog:true な全件に aiUsageLogTemplate が存在するか

使い方:
    python3 scripts/audit_data_consistency.py
    python3 scripts/audit_data_consistency.py --root /path/to/Hoku-Tech

戻り値:
    0 = 全チェック合格
    1 = 1 つでも失敗
    2 = 入力エラー (data/ が無い等)
"""

import argparse
import re
import sys
from pathlib import Path


# ─── 色付け (TTY のみ) ───────────────────────────────────────

def _color(s: str, code: str) -> str:
    if sys.stdout.isatty():
        return f"\033[{code}m{s}\033[0m"
    return s


def GREEN(s: str) -> str:  return _color(s, '32')
def RED(s: str) -> str:    return _color(s, '31')
def YELLOW(s: str) -> str: return _color(s, '33')
def BOLD(s: str) -> str:   return _color(s, '1')


# ─── JS ブロックスキャナ (文字列内の波括弧は無視) ────────────

def _scan_block(text: str, start_idx: int):
    """`text[start_idx]` が '{' を指す前提で、対応 '}' の +1 位置を返す。
    JS 文字列 ('...' or "...") 内の括弧と、バックスラッシュエスケープを正しく扱う。
    見つからなければ None を返す。
    """
    depth = 0
    i = start_idx
    in_str = None  # 文字列内なら開始クオート文字
    n = len(text)
    while i < n:
        c = text[i]
        if in_str is not None:
            if c == '\\':           # JS 文字列内エスケープ: 次の 1 文字を読み飛ばす
                i += 2
                continue
            if c == in_str:
                in_str = None
        else:
            if c in ("'", '"'):
                in_str = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return i + 1
        i += 1
    return None


# ─── パーサ ──────────────────────────────────────────────────

LESSON_KEY_RE = re.compile(r"^\s*'(l\d{2}-\d+-\d+)'\s*:\s*\{", re.MULTILINE)
NEXT_LESSON_RE = re.compile(r"\bnextLesson\s*:\s*(?:'([^']+)'|null)")
CHAPTER_KEY_RE = re.compile(r"'(c\d{2}-\d+)'\s*:\s*\{")
CHAPTER_LESSONS_RE = re.compile(r"\blessons\s*:\s*\[([^\]]*)\]", re.DOTALL)
ASSIGNMENT_START_RE = re.compile(r"\{\s*phase\s*:\s*'p\d{2}'")
ASSIGNMENT_ID_RE = re.compile(r"\bid\s*:\s*'(a\d+)'")
ASSIGNMENT_HOKI_RE = re.compile(r"\bhokiLog\s*:\s*(true|false)\b")
QUOTED_STR_RE = re.compile(r"'([^']+)'")


def parse_lesson_file(file_path: Path) -> dict:
    """1 ファイル分の Lesson を返す。{ lesson_id: nextLesson_id_or_None }"""
    text = file_path.read_text(encoding='utf-8')
    lessons = {}
    matches = list(LESSON_KEY_RE.finditer(text))
    for m in matches:
        lid = m.group(1)
        # m.group(0) の中の最後の '{' の絶対位置
        brace_idx = m.start() + m.group(0).rfind('{')
        end = _scan_block(text, brace_idx)
        if end is None:
            continue
        block = text[brace_idx:end]
        nl_m = NEXT_LESSON_RE.search(block)
        if nl_m and nl_m.group(1):
            lessons[lid] = nl_m.group(1)
        else:
            lessons[lid] = None  # null または記載なし
    return lessons


def merge_all_lessons(data_dir: Path) -> dict:
    """data/lesson-p*.js を全て読んで Object.assign 相当でマージ。"""
    merged = {}
    # base ファイルを先に処理して append ファイルで上書きされる順にする
    # (append ファイル名: 'lesson-p02-append.js' は base より後に処理する)
    files = sorted(data_dir.glob('lesson-p*.js'),
                   key=lambda p: (p.stem.replace('-append', ''), 'append' in p.stem))
    for f in files:
        merged.update(parse_lesson_file(f))
    return merged


def parse_chapters(file_path: Path) -> dict:
    """{ chapter_id: [lesson_id, ...] } を返す。"""
    text = file_path.read_text(encoding='utf-8')
    chapters = {}
    for m in CHAPTER_KEY_RE.finditer(text):
        cid = m.group(1)
        brace_idx = m.end() - 1  # '{' の位置
        end = _scan_block(text, brace_idx)
        if end is None:
            continue
        block = text[brace_idx:end]
        lessons_m = CHAPTER_LESSONS_RE.search(block)
        lesson_ids = []
        if lessons_m:
            lesson_ids = QUOTED_STR_RE.findall(lessons_m.group(1))
        chapters[cid] = lesson_ids
    return chapters


def parse_assignments(file_path: Path) -> list:
    """[{ id, hokiLog, fields:{name:bool} }] を返す。"""
    text = file_path.read_text(encoding='utf-8')
    results = []
    target_fields = (
        'optionalFeatures',
        'readmeChecklist',
        'instructorCheckPoints',
        'scoringRubric',
        'aiUsageLogTemplate',
    )
    for m in ASSIGNMENT_START_RE.finditer(text):
        end = _scan_block(text, m.start())
        if end is None:
            continue
        block = text[m.start():end]
        id_m = ASSIGNMENT_ID_RE.search(block)
        if not id_m:
            continue
        aid = id_m.group(1)
        hoki_m = ASSIGNMENT_HOKI_RE.search(block)
        hoki = (hoki_m.group(1) == 'true') if hoki_m else False
        fields = {}
        for f in target_fields:
            fields[f] = re.search(rf"\b{re.escape(f)}\s*:", block) is not None
        results.append({'id': aid, 'hokiLog': hoki, 'fields': fields})
    return results


# ─── チェック関数 (純粋関数) ──────────────────────────────────

def check_chapter_lesson_refs(chapters: dict, all_lessons: dict):
    broken = []
    for cid, lesson_ids in chapters.items():
        for lid in lesson_ids:
            if lid not in all_lessons:
                broken.append((cid, lid))
    return broken


def check_next_lesson_refs(all_lessons: dict):
    broken = []
    for lid, next_lid in all_lessons.items():
        if next_lid is None:
            continue
        if next_lid not in all_lessons:
            broken.append((lid, next_lid))
    return broken


def check_orphan_lessons(all_lessons: dict, chapters: dict):
    listed = set()
    for lesson_ids in chapters.values():
        listed.update(lesson_ids)
    return sorted([lid for lid in all_lessons if lid not in listed])


def check_assignment_fields(assignments: list):
    required = ('optionalFeatures', 'readmeChecklist', 'instructorCheckPoints', 'scoringRubric')
    out = []
    for a in assignments:
        miss = [f for f in required if not a['fields'].get(f)]
        if miss:
            out.append((a['id'], miss))
    return out


def check_ai_usage_log(assignments: list):
    out = []
    for a in assignments:
        if a['hokiLog'] and not a['fields'].get('aiUsageLogTemplate'):
            out.append(a['id'])
    return out


# ─── メイン ──────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description='Hoku Tech data/*.js 整合性検査 (Python 標準ライブラリのみ)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--root', default=None,
                        help='プロジェクトルート (デフォルト: スクリプトの 1 つ上のディレクトリ)')
    args = parser.parse_args()

    root = Path(args.root).resolve() if args.root else Path(__file__).resolve().parent.parent
    data = root / 'data'
    if not data.is_dir():
        print(RED(f'ERROR: data/ ディレクトリが見つからない: {data}'), file=sys.stderr)
        return 2

    all_lessons = merge_all_lessons(data)
    chapters = parse_chapters(data / 'chapters.js')
    assignments = parse_assignments(data / 'assignments.js')

    print(BOLD('=== Hoku Tech data/*.js 整合性検査 ==='))
    print(f'対象ルート: {root}')
    print(f'全 Lesson 数:     {len(all_lessons)}')
    print(f'全 Chapter 数:    {len(chapters)}')
    print(f'全 Assignment 数: {len(assignments)}')
    print()

    all_passed = True

    # [1] chapter.lessons[] → lesson
    print(BOLD('[1/5] chapter.lessons[] → 実在 Lesson 参照'))
    broken1 = check_chapter_lesson_refs(chapters, all_lessons)
    if broken1:
        all_passed = False
        print(RED(f'  NG: {len(broken1)} 件の壊れた参照'))
        for cid, lid in broken1:
            print(f'    - Chapter {cid} → Lesson {lid} (存在しない)')
    else:
        print(GREEN('  OK: 全 chapter.lessons[] 参照が実在 Lesson を指す'))
    print()

    # [2] lesson.nextLesson → lesson
    print(BOLD('[2/5] lesson.nextLesson → 実在 Lesson 参照'))
    broken2 = check_next_lesson_refs(all_lessons)
    if broken2:
        all_passed = False
        print(RED(f'  NG: {len(broken2)} 件の壊れた nextLesson'))
        for lid, nl in broken2:
            print(f'    - {lid}.nextLesson → {nl} (存在しない)')
    else:
        print(GREEN('  OK: 全 nextLesson が実在 Lesson を指すか null'))
    print()

    # [3] orphan
    print(BOLD('[3/5] 孤立 Lesson (chapter.lessons[] 未掲載)'))
    orphans = check_orphan_lessons(all_lessons, chapters)
    if orphans:
        all_passed = False
        print(RED(f'  NG: {len(orphans)} 件の孤立 Lesson'))
        for lid in orphans:
            print(f'    - {lid} (どの chapter.lessons[] にも含まれていない)')
    else:
        print(GREEN('  OK: 全 Lesson が何れかの chapter.lessons[] に掲載'))
    print()

    # [4] Assignment 4 fields
    print(BOLD('[4/5] Assignment 必須 4 フィールド'))
    print('       (optionalFeatures / readmeChecklist / instructorCheckPoints / scoringRubric)')
    missing4 = check_assignment_fields(assignments)
    if missing4:
        all_passed = False
        print(RED(f'  NG: {len(missing4)} 件の Assignment にフィールド欠落'))
        for aid, miss in missing4:
            print(f'    - {aid}: 欠落 = {", ".join(miss)}')
    else:
        print(GREEN(f'  OK: 全 {len(assignments)} 件が 4 フィールドを保持'))
    print()

    # [5] aiUsageLogTemplate on hokiLog:true
    print(BOLD('[5/5] hokiLog:true な Assignment は aiUsageLogTemplate を持つ'))
    missing5 = check_ai_usage_log(assignments)
    hoki_true_count = sum(1 for a in assignments if a['hokiLog'])
    if missing5:
        all_passed = False
        print(RED(f'  NG: {len(missing5)}/{hoki_true_count} 件で aiUsageLogTemplate 欠落'))
        for aid in missing5:
            print(f'    - {aid}: aiUsageLogTemplate 無し (hokiLog:true)')
    else:
        print(GREEN(f'  OK: hokiLog:true な全 {hoki_true_count} 件が aiUsageLogTemplate を保持'))
    print()

    if all_passed:
        print(GREEN(BOLD('=== ALL CHECKS PASSED ===')))
        return 0
    print(RED(BOLD('=== ONE OR MORE CHECKS FAILED ===')))
    return 1


if __name__ == '__main__':
    sys.exit(main())
