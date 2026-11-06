package com.example.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    public static void main(String[] args) throws SQLException {
        // 接続情報はソースコードに書かず、環境変数から読む (パスワードを Git に入れないため)
        String url = System.getenv("DB_URL");   // 例: jdbc:postgresql://localhost:5432/its_practice
        String user = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");

        // try-with-resources: ブロックを抜けると接続が自動で閉じる
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            try (Statement st = conn.createStatement()) {
                st.execute("CREATE TABLE members (id INTEGER PRIMARY KEY, name VARCHAR(30) NOT NULL, point INTEGER NOT NULL)");
            }

            // INSERT: 値は ? に入れる (PreparedStatement)
            String insert = "INSERT INTO members (id, name, point) VALUES (?, ?, ?)";
            try (PreparedStatement ps = conn.prepareStatement(insert)) {
                Object[][] rows = {{1, "山田", 120}, {2, "佐藤", 80}, {3, "鈴木", 200}};
                for (Object[] r : rows) {
                    ps.setInt(1, (Integer) r[0]);
                    ps.setString(2, (String) r[1]);
                    ps.setInt(3, (Integer) r[2]);
                    ps.executeUpdate();
                }
            }

            // SELECT: 結果は ResultSet を next() で 1 行ずつ読む
            System.out.println("--- 100 ポイント以上の会員");
            try (PreparedStatement ps = conn.prepareStatement("SELECT name, point FROM members WHERE point >= ? ORDER BY id")) {
                ps.setInt(1, 100);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        System.out.println(rs.getString("name") + ": " + rs.getInt("point"));
                    }
                }
            }

            // SQL インジェクション: 入力を文字列連結すると、条件を書き換えられてしまう
            String input = "' OR '1'='1";
            System.out.println("--- 名前で検索 (入力: " + input + ")");
            try (Statement st = conn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM members WHERE name = '" + input + "'")) {
                rs.next();
                System.out.println("文字列連結 (危険): " + rs.getInt(1) + " 件");
            }
            try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM members WHERE name = ?")) {
                ps.setString(1, input); // 入力はただの文字列として扱われる
                try (ResultSet rs = ps.executeQuery()) {
                    rs.next();
                    System.out.println("PreparedStatement (安全): " + rs.getInt(1) + " 件");
                }
            }

            // トランザクション: ポイントの移動は「両方成功」か「両方取り消し」
            System.out.println("--- ポイント移動");
            transfer(conn, 1, 2, 50);
            try {
                transfer(conn, 2, 3, 1000); // 残高不足で失敗させる
            } catch (SQLException e) {
                System.out.println("失敗したので取り消し: " + e.getMessage());
            }
            try (PreparedStatement ps = conn.prepareStatement("SELECT name, point FROM members ORDER BY id");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    System.out.println(rs.getString("name") + ": " + rs.getInt("point"));
                }
            }
        }
    }

    static void transfer(Connection conn, int from, int to, int amount) throws SQLException {
        conn.setAutoCommit(false); // ここからトランザクション
        try (PreparedStatement minus = conn.prepareStatement("UPDATE members SET point = point - ? WHERE id = ?");
             PreparedStatement plus = conn.prepareStatement("UPDATE members SET point = point + ? WHERE id = ?");
             PreparedStatement check = conn.prepareStatement("SELECT point FROM members WHERE id = ?")) {
            minus.setInt(1, amount);
            minus.setInt(2, from);
            minus.executeUpdate();
            check.setInt(1, from);
            try (ResultSet rs = check.executeQuery()) {
                rs.next();
                if (rs.getInt(1) < 0) {
                    throw new SQLException("ポイントが足りません");
                }
            }
            plus.setInt(1, amount);
            plus.setInt(2, to);
            plus.executeUpdate();
            conn.commit();
            System.out.println(amount + " ポイント移動しました");
        } catch (SQLException e) {
            conn.rollback();
            throw e;
        } finally {
            conn.setAutoCommit(true);
        }
    }
}
