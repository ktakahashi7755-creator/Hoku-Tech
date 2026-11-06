public class Main {
    // 税込価格を計算する。引数: 税抜価格 / 戻り値: 税込価格 (1 円未満切り捨て)
    static int withTax(int price) {
        return price * 110 / 100; // お金の計算は小数 (double) を避け、整数で行う
    }

    // 戻り値のないメソッドは void
    static void printReceipt(String item, int price) {
        System.out.println(item + ": " + withTax(price) + "円 (税込)");
    }

    // オーバーロード: 同じ名前で引数の型・数が違うメソッド
    static int add(int a, int b) {
        return a + b;
    }

    static double add(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        printReceipt("ノート", 300);
        printReceipt("ペン", 150);
        System.out.println(add(2, 3));
        System.out.println(add(1.5, 2.25));
    }
}
