import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class Main {
    // 検査例外 (IOException) を呼び出し元に任せるときは throws を書く
    static int sumLines(BufferedReader reader) throws IOException {
        int sum = 0;
        String line;
        while ((line = reader.readLine()) != null) {
            sum += parseScore(line);
        }
        return sum;
    }

    static int parseScore(String text) {
        int value = Integer.parseInt(text.trim()); // 数字でなければ NumberFormatException
        if (value < 0 || value > 100) {
            throw new IllegalArgumentException("点数は 0〜100 です: " + value);
        }
        return value;
    }

    public static void main(String[] args) {
        String[] inputs = {"80\n70\n90", "80\nabc", "80\n150"};
        for (String input : inputs) {
            // try-with-resources: ブロックを抜けると reader は自動で close される
            try (BufferedReader reader = new BufferedReader(new StringReader(input))) {
                System.out.println("合計: " + sumLines(reader));
            } catch (NumberFormatException e) {
                System.out.println("数字ではない行があります: " + e.getMessage());
            } catch (IllegalArgumentException e) {
                System.out.println("範囲外の値があります: " + e.getMessage());
            } catch (IOException e) {
                System.out.println("読み込みに失敗しました: " + e.getMessage());
            } finally {
                System.out.println("-- 1 件の処理を終了");
            }
        }
    }
}
