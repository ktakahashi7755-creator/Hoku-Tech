public class Main {
    public static void main(String[] args) {
        Employee a = new Employee("佐藤", 300_000);
        Manager b = new Manager("鈴木", 400_000, 50_000);

        System.out.println(a.describe());
        System.out.println(b.describe());

        // 親クラスの型の変数に子クラスのオブジェクトを入れられる
        Employee e = b;
        System.out.println("月給: " + e.monthlyPay() + "円"); // 実行されるのは Manager の monthlyPay
    }
}

class Employee {
    protected final String name;
    protected final int baseSalary;

    Employee(String name, int baseSalary) {
        this.name = name;              // this.name はフィールド、name は引数
        this.baseSalary = baseSalary;
    }

    int monthlyPay() {
        return baseSalary;
    }

    String describe() {
        return name + " さん: " + monthlyPay() + "円";
    }
}

class Manager extends Employee {
    private final int allowance; // 管理職手当

    Manager(String name, int baseSalary, int allowance) {
        super(name, baseSalary); // 親クラスのコンストラクタを最初に呼ぶ
        this.allowance = allowance;
    }

    @Override
    int monthlyPay() {
        return super.monthlyPay() + allowance; // 親の計算結果に手当を足す
    }
}
