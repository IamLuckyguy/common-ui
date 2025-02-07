package kr.co.kwt.commonui;

public class ServiceInfo {
    private final String id;
    private final String name;
    private final String url;
    private final String themeColor;

    public ServiceInfo(String id, String name, String url, String themeColor) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.themeColor = themeColor;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

    public String getThemeColor() {
        return themeColor;
    }
}