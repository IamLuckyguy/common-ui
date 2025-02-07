package kr.co.kwt.commonui;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.Map;

@Configuration
@Component
@EnableConfigurationProperties(ServiceProperties.class)
public class ServiceConfig {

    private final ServiceProperties serviceProperties;
    private final String currentServiceId;
    private ServiceInfo currentService;

    public ServiceConfig(
            ServiceProperties serviceProperties,
            @Value("${app.service}") String currentServiceId
    ) {
        this.serviceProperties = serviceProperties;
        this.currentServiceId = currentServiceId;
        initCurrentService();
    }

    private void initCurrentService() {
        ServiceProperties.ServiceConfig config = serviceProperties.getServices().get(currentServiceId);
        if (config != null) {
            this.currentService = new ServiceInfo(
                    currentServiceId,
                    config.getName(),
                    config.getUrl()
            );
        }
    }

    public ServiceInfo getCurrentService() {
        return currentService;
    }

    public Map<String, ServiceProperties.ServiceConfig> getServices() {
        return serviceProperties.getServices();
    }
}