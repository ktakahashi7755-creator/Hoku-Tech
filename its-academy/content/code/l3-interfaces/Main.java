import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Notifier> notifiers = List.of(
                new EmailNotifier("hanako@example.com"),
                new ChatNotifier("#its-2026"),
                new EmailNotifier("ken@example.com"));

        // 呼び出す側は「通知できる」ことだけを知っていればよい (ポリモーフィズム)
        for (Notifier n : notifiers) {
            n.send("課題の締め切りは金曜日です");
        }
        System.out.println("送信件数: " + notifiers.size());
    }
}

interface Notifier {
    void send(String message);
}

class EmailNotifier implements Notifier {
    private final String address;

    EmailNotifier(String address) {
        this.address = address;
    }

    @Override
    public void send(String message) {
        System.out.println("[メール] " + address + " へ: " + message);
    }
}

class ChatNotifier implements Notifier {
    private final String channel;

    ChatNotifier(String channel) {
        this.channel = channel;
    }

    @Override
    public void send(String message) {
        System.out.println("[チャット] " + channel + " へ: " + message);
    }
}
