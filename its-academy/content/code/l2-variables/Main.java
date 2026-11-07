public class Main {
    public static void main(String[] args) {
        int price = 1200;          // 整数 (お金は整数で扱う)
        double rating = 4.5;       // 小数 (お金以外の値。例: レビューの平均点)
        boolean isMember = true;   // 真偽値
        String item = "Java入門書"; // 文字列 (参照型)

        // 税込価格 (税率 10%)。お金の計算は誤差の出る double を避け、整数で行う (先に掛けてから割る)
        int total = price * 110 / 100;
        System.out.println(item + " の税込価格: " + total + "円");
        System.out.println("評価: " + rating);
        System.out.println("会員ですか: " + isMember);

        int a = 7;
        int b = 2;
        System.out.println("7 / 2 = " + (a / b));
        System.out.println("7 % 2 = " + (a % b));
        System.out.println("7.0 / 2 = " + (7.0 / b));
        System.out.println("(int) 3.9 = " + (int) 3.9); // キャスト: 小数点以下は切り捨て
    }
}
