import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        // List: 順番があり、重複してよい
        List<String> tasks = new ArrayList<>();
        tasks.add("環境構築");
        tasks.add("Git の基本");
        tasks.add("変数とデータ型");
        tasks.remove("Git の基本");
        System.out.println("タスク: " + tasks + " (" + tasks.size() + " 件)");

        // Set: 重複しない
        Set<String> tags = new HashSet<>(List.of("java", "sql", "java"));
        System.out.println("タグの数: " + tags.size());
        System.out.println("sql を含む: " + tags.contains("sql"));

        // Map: キーで値を引く。LinkedHashMap は追加した順を保つ
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.put("山田", 82);
        scores.put("佐藤", 67);
        scores.put("山田", 90); // 同じキーは上書き
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        System.out.println("鈴木の点数: " + scores.getOrDefault("鈴木", 0));
    }
}
