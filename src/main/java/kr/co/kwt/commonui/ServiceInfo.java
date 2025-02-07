package kr.co.kwt.commonui;

public class ServiceInfo {
    private String serviceId;
    private String serviceName;
    private String serviceUrl;
    private String themeColor;

    public String getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getServiceUrl() {
        return serviceUrl;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public ServiceInfo(String serviceId, String serviceName, String serviceUrl, String themeColor) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceUrl = serviceUrl;
        this.themeColor = themeColor;
    }
}
