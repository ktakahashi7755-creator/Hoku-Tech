source ./verify-lib.sh
call POST /api/books '{"title":"Java 入門","author":"山田","isbn":"9784000000001"}'
call POST /api/books '{"title":"SQL 入門","author":"佐藤","isbn":"9784000000002"}'
call GET  /api/books
call PUT  /api/books/1 '{"title":"Java 入門 第 2 版","author":"山田","isbn":"9784000000001"}'
call GET  "/api/books?author=%E5%B1%B1%E7%94%B0"   # 山田 を URL エンコードしたもの
call POST /api/books '{"title":"","author":"佐藤","isbn":"123"}'
call POST /api/books '{"title":"別の本","author":"鈴木","isbn":"9784000000002"}'
call DELETE /api/books/2
call GET  /api/books/2
