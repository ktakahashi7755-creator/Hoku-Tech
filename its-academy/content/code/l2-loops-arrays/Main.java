public class Main {
    public static void main(String[] args) {
        int[] scores = {72, 88, 95, 61, 79};

        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        System.out.println("人数: " + scores.length);
        System.out.println("合計: " + sum);
        System.out.println("平均: " + (double) sum / scores.length);

        int max = scores[0];
        for (int score : scores) {
            if (score > max) {
                max = score;
            }
        }
        System.out.println("最高点: " + max);

        int count = 0;
        while (count < 3) {
            System.out.println("while の " + (count + 1) + " 回目");
            count++;
        }
    }
}
