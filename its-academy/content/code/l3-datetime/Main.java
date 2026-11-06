import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class Main {
    public static void main(String[] args) {
        // 実行日によって結果が変わらないよう、日付を固定して試す
        LocalDate lent = LocalDate.of(2026, 10, 20);       // 貸出日
        LocalDate due = lent.plusWeeks(2);                 // 返却期限 (2 週間後)
        LocalDate returned = LocalDate.of(2026, 11, 6);    // 返却日

        System.out.println("返却期限: " + due);
        System.out.println("期限の曜日: " + due.getDayOfWeek());
        long late = ChronoUnit.DAYS.between(due, returned);
        System.out.println("延滞日数: " + Math.max(late, 0) + " 日");
        System.out.println("延滞している: " + returned.isAfter(due));

        System.out.println("2028 年はうるう年: " + LocalDate.of(2028, 1, 1).isLeapYear());
        System.out.println("1 月 31 日の 1 か月後: " + LocalDate.of(2026, 1, 31).plusMonths(1));

        DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy年M月d日 H時mm分");
        LocalDateTime meeting = LocalDateTime.of(2026, 11, 9, 14, 5);
        System.out.println("面談: " + meeting.format(f));
        System.out.println("文字列から: " + LocalDate.parse("2026-12-24").getDayOfWeek().equals(DayOfWeek.THURSDAY));
    }
}
