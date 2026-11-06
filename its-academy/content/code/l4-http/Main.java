import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class Main {
    public static void main(String[] args) throws IOException, InterruptedException {
        // 1. 小さな Web サーバーを起動する (ポート 0 = 空いている番号を自動で選ぶ)
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/hello", exchange -> {
            String query = exchange.getRequestURI().getQuery(); // 例: name=hanako
            String name = query != null && query.startsWith("name=") ? query.substring(5) : "guest";
            byte[] body = ("Hello, " + name).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "text/plain; charset=utf-8");
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.createContext("/tasks", exchange -> {
            if (!exchange.getRequestMethod().equals("POST")) {
                exchange.sendResponseHeaders(405, -1); // POST 以外は受け付けない
                exchange.close();
                return;
            }
            String received = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            byte[] body = ("created: " + received).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Location", "/tasks/1");
            exchange.sendResponseHeaders(201, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.start();
        String base = "http://127.0.0.1:" + server.getAddress().getPort();

        // 2. クライアントとしてリクエストを送り、レスポンスを表示する
        HttpClient client = HttpClient.newHttpClient();
        send(client, HttpRequest.newBuilder(URI.create(base + "/hello?name=hanako")).GET().build());
        send(client, HttpRequest.newBuilder(URI.create(base + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"title\":\"課題を提出する\"}"))
                .build());
        send(client, HttpRequest.newBuilder(URI.create(base + "/tasks")).GET().build());
        send(client, HttpRequest.newBuilder(URI.create(base + "/nothing")).GET().build());

        server.stop(0);
    }

    static void send(HttpClient client, HttpRequest request) throws IOException, InterruptedException {
        HttpResponse<String> res = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(request.method() + " " + request.uri().getPath() + " -> " + res.statusCode());
        res.headers().firstValue("Location").ifPresent(v -> System.out.println("  Location: " + v));
        if (!res.body().isEmpty()) System.out.println("  " + res.body());
    }
}
