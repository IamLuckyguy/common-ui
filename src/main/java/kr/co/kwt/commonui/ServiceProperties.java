package kr.co.kwt.commonui;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "service")
public class ServiceProperties {
    private String id;
    private String name;
    private String url;
    private String themeColor;

    public ServiceProperties() {
    }

    public ServiceProperties(String id, String name, String url, String themeColor) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.themeColor = themeColor;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public String getThemeClass() {
        return id + "-service";
    }

    // themeColor를 RGB 형식으로 변환하여 반환
    public String getThemeColorRgb() {
        if (themeColor == null || !themeColor.startsWith("#") || themeColor.length() != 7) {
            return "0, 0, 0"; // 기본값
        }

        try {
            // #00ff88 형식의 hex 값을 RGB로 변환
            int r = Integer.parseInt(themeColor.substring(1, 3), 16);
            int g = Integer.parseInt(themeColor.substring(3, 5), 16);
            int b = Integer.parseInt(themeColor.substring(5, 7), 16);
            return String.format("%d, %d, %d", r, g, b);
        } catch (Exception e) {
            return "0, 0, 0"; // 파싱 실패시 기본값
        }
    }

    @Override
    public String toString() {
        return "ServiceProperties{" +
                "name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", themeColor='" + themeColor + '\'' +
                '}';
    }
}