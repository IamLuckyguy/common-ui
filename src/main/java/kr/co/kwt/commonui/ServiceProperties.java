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

    public String getThemeColorRgb() {
        return themeColor != null && themeColor.startsWith("#")
                ? themeColor.substring(1)
                : themeColor;
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