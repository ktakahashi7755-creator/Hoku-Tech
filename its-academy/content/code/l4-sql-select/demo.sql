-- 何度実行しても同じ結果になるように、前に作った同じ名前のテーブルを先に削除する
-- (初回は「テーブルがないので飛ばした」という NOTICE が出るが、エラーではない)
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id         INTEGER      PRIMARY KEY,
    name       VARCHAR(50)  NOT NULL,
    price      INTEGER      NOT NULL CHECK (price >= 0),
    stock      INTEGER      NOT NULL DEFAULT 0
);

INSERT INTO products (id, name, price, stock) VALUES
    (1, 'ノート',         300, 120),
    (2, 'ボールペン',     150,   0),
    (3, 'ノートパソコン', 98000,  5),
    (4, '付箋',           200,  40);

\echo '--- 300 円以下の商品を安い順に'
SELECT name, price FROM products WHERE price <= 300 ORDER BY price;

\echo '--- 名前に「ノート」を含み、在庫がある商品'
SELECT id, name, stock FROM products WHERE name LIKE '%ノート%' AND stock > 0 ORDER BY id;
