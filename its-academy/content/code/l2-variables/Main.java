public class Main {
    public static void main(String[] args) {
        int price = 1200;          // 整数
        double taxRate = 0.1;      // 小数
        boolean isMember = true;   // 真偽値
        String item = "Java入門書"; // 文字列 (参照型)

        int total = (int) (price * (1 + taxRate)); // 小数を含む計算結果を int に変換 (小数点以下は切り捨て)
        System.out.println(item + " の税込価格: " + total + "円");
        System.out.println("会員ですか: " + isMember);

        int a = 7;
        int b = 2;
        System.out.println("7 / 2 = " + (a / b));
        System.out.println("7 % 2 = " + (a % b));
        System.out.println("7.0 / 2 = " + (7.0 / b));
    }
}
