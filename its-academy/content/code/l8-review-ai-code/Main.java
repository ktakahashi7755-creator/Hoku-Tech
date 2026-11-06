import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * AI に「貸出のルール (1 人 3 冊まで・返却期限は 2 週間・延滞中は貸さない) を判定するメソッドを書いて」と
 * 依頼して得たコード (AiDraft) を、受け入れる前にテストで確かめる。
 */
public class Main {

    // ---- AI が出したコード (そのままでは使わない) ----
    static class AiDraft {
        static boolean canLend(int borrowedCount, LocalDate oldestDue, LocalDate today) {
            boolean overdue = oldestDue != null && today.isAfter(oldestDue.plusDays(1));
            return borrowedCount <= 3 && !overdue;
        }

        static long overdueDays(LocalDate due, LocalDate returned) {
            return ChronoUnit.DAYS.between(due, returned);
        }
    }

    // ---- 自分で確かめて直したコード ----
    static class Reviewed {
        static final int LIMIT = 3;

        /** 借りている冊数が上限未満で、延滞中の本がなければ貸せる */
        static boolean canLend(int borrowedCount, LocalDate oldestDue, LocalDate today) {
            boolean overdue = oldestDue != null && today.isAfter(oldestDue);
            return borrowedCount < LIMIT && !overdue;
        }

        /** 延滞日数。期限内の返却は 0 */
        static long overdueDays(LocalDate due, LocalDate returned) {
            return Math.max(0, ChronoUnit.DAYS.between(due, returned));
        }
    }

    interface Lender { boolean canLend(int count, LocalDate oldestDue, LocalDate today); }
    interface Overdue { long days(LocalDate due, LocalDate returned); }

    static int failures;

    static void check(String name, Object expected, Object actual) {
        boolean ok = expected.equals(actual);
        if (!ok) failures++;
        System.out.println((ok ? "  OK  " : "  NG  ") + name + (ok ? "" : " (期待 " + expected + " / 実際 " + actual + ")"));
    }

    static void test(String label, Lender lender, Overdue overdue) {
        failures = 0;
        LocalDate today = LocalDate.of(2026, 11, 10);
        System.out.println(label);
        check("2 冊借りていれば貸せる", true, lender.canLend(2, null, today));
        check("3 冊借りていたら貸せない (上限 3 冊)", false, lender.canLend(3, null, today));
        check("期限の当日はまだ延滞ではない", true, lender.canLend(1, today, today));
        check("期限の翌日は延滞なので貸せない", false, lender.canLend(1, today.minusDays(1), today));
        check("期限内に返せば延滞 0 日", 0L, overdue.days(today, today.minusDays(3)));
        check("期限の 2 日後に返せば延滞 2 日", 2L, overdue.days(today, today.plusDays(2)));
        System.out.println("  → 不合格 " + failures + " 件");
    }

    public static void main(String[] args) {
        test("[AI が出したコード]", AiDraft::canLend, AiDraft::overdueDays);
        test("[確かめて直したコード]", Reviewed::canLend, Reviewed::overdueDays);
    }
}
