CREATE TABLE members (
    id         INTEGER     PRIMARY KEY,
    name       VARCHAR(30) NOT NULL,
    plan       VARCHAR(10) NOT NULL,
    deleted_at TIMESTAMP              -- 論理削除: 削除した日時を入れる (NULL なら有効)
);

INSERT INTO members (id, name, plan) VALUES (1, '山田', 'basic'), (2, '佐藤', 'basic'), (3, '鈴木', 'pro');

\echo '--- UPDATE は必ず WHERE を付け、先に同じ条件で SELECT して対象を確かめる'
SELECT id, name, plan FROM members WHERE id = 2;
UPDATE members SET plan = 'pro' WHERE id = 2;

\echo '--- トランザクション: 誤って全件を更新しても ROLLBACK で元に戻せる'
BEGIN;
UPDATE members SET plan = 'free';
SELECT COUNT(*) AS free_の件数 FROM members WHERE plan = 'free';
ROLLBACK;
SELECT id, name, plan FROM members ORDER BY id;

\echo '--- 論理削除と物理削除'
UPDATE members SET deleted_at = TIMESTAMP '2026-11-06 10:00' WHERE id = 1;
DELETE FROM members WHERE id = 3;
SELECT id, name, plan FROM members WHERE deleted_at IS NULL ORDER BY id;
