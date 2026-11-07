-- 何度実行しても同じ結果になるように、前に作った同じ名前のテーブルを先に削除する
-- (初回は「テーブルがないので飛ばした」という NOTICE が出るが、エラーではない)
-- products は categories を参照している (外部キー) ので、2 つを同じ文でまとめて削除する
DROP TABLE IF EXISTS products, categories;

CREATE TABLE categories (
    id   INTEGER     PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE products (
    id          INTEGER     PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    price       INTEGER     NOT NULL,
    category_id INTEGER     REFERENCES categories (id)  -- 外部キー
);

INSERT INTO categories (id, name) VALUES (1, '文房具'), (2, 'パソコン'), (3, '書籍');
INSERT INTO products (id, name, price, category_id) VALUES
    (1, 'ノート',          300, 1),
    (2, 'ボールペン',      150, 1),
    (3, 'ノートパソコン', 98000, 2),
    (4, 'マウス',         2500, 2),
    (5, '福袋',           3000, NULL);

\echo '--- INNER JOIN: カテゴリのある商品だけ'
SELECT p.name AS 商品, c.name AS カテゴリ
FROM products p
INNER JOIN categories c ON p.category_id = c.id
ORDER BY p.id;

\echo '--- LEFT JOIN: 商品のないカテゴリも残す。カテゴリごとの件数と平均価格'
SELECT c.name AS カテゴリ, COUNT(p.id) AS 件数, ROUND(AVG(p.price)) AS 平均価格
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;

\echo '--- HAVING: 平均価格が 1000 円以上のカテゴリ'
SELECT c.name AS カテゴリ, ROUND(AVG(p.price)) AS 平均価格
FROM categories c
JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
HAVING AVG(p.price) >= 1000;
