package kr.co.kwt.commonui;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.List;

@Configuration
public class ServiceConfig {

    private final ServiceUrlConfig serviceUrlConfig;
    private final Environment environment;

    public ServiceConfig(ServiceUrlConfig serviceUrlConfig, Environment environment) {
        this.serviceUrlConfig = serviceUrlConfig;
        this.environment = environment;
    }

    @Bean
    public List<ServiceInfo> services() {
        String activeProfile = environment.getActiveProfiles()[0];
        return Arrays.asList(
                new ServiceInfo("exchange", "환율계산기", getUrl(serviceUrlConfig.getExchange(), activeProfile)),
                new ServiceInfo("salary", "연봉계산기", getUrl(serviceUrlConfig.getSalary(), activeProfile))
        );
    }

    private String getUrl(ServiceUrlConfig.ServiceUrls urls, String profile) {
        return switch (profile) {
            case "dev" -> urls.getDev();
            case "prod" -> urls.getProd();
            default -> urls.getLocal();
        };
    }
}