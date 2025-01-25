package kr.co.kwt.commonui;

public class ServiceInfo {
    private String serviceId;
    private String serviceName;
    private String serviceUrl;

    public String getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getServiceUrl() {
        return serviceUrl;
    }

    public ServiceInfo(String serviceId, String serviceName, String serviceUrl) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceUrl = serviceUrl;
    }
}
