public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("山田 花子", 1000);
        account.deposit(500);
        System.out.println(account.getOwner() + " の残高: " + account.getBalance() + "円");

        try {
            account.withdraw(3000);
        } catch (IllegalArgumentException e) {
            System.out.println("エラー: " + e.getMessage());
        }
        System.out.println("残高は変わらない: " + account.getBalance() + "円");
    }
}

class BankAccount {
    private final String owner; // 外から直接変更させない
    private int balance;

    BankAccount(String owner, int initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("初期残高は 0 円以上にしてください");
        }
        this.owner = owner;
        this.balance = initialBalance;
    }

    void deposit(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("入金額は 1 円以上にしてください");
        }
        balance += amount;
    }

    void withdraw(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("出金額は 1 円以上にしてください");
        }
        if (amount > balance) {
            throw new IllegalArgumentException("残高不足です (残高 " + balance + "円)");
        }
        balance -= amount;
    }

    String getOwner() {
        return owner;
    }

    int getBalance() {
        return balance;
    }
}
