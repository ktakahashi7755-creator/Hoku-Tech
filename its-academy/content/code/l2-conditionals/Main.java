public class Main {
    static String judge(int score) {
        if (score < 0 || score > 100) {
            return "入力エラー: 0〜100 で入力してください";
        } else if (score >= 80) {
            return "A";
        } else if (score >= 60) {
            return "B";
        } else {
            return "再挑戦";
        }
    }

    public static void main(String[] args) {
        int[] scores = {95, 80, 65, 40, 120};
        for (int score : scores) {
            System.out.println(score + "点 -> " + judge(score));
        }

        String day = "SAT";
        String type = switch (day) {
            case "SAT", "SUN" -> "休日";
            default -> "平日";
        };
        System.out.println(day + " は " + type);

        String input = new String("yes");
        System.out.println("== で比較: " + (input == "yes"));
        System.out.println("equals で比較: " + input.equals("yes"));
    }
}
