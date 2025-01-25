package kr.co.kwt.commonui;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "service.urls")
public class ServiceUrlConfig {
    private ServiceUrls exchange;
    private ServiceUrls salary;

    public static class ServiceUrls {
        private String local;
        private String dev;
        private String prod;

        public String getLocal() {
            return local;
        }

        public void setLocal(String local) {
            this.local = local;
        }

        public String getDev() {
            return dev;
        }

        public void setDev(String dev) {
            this.dev = dev;
        }

        public String getProd() {
            return prod;
        }

        public void setProd(String prod) {
            this.prod = prod;
        }
    }

    public ServiceUrls getExchange() {
        return exchange;
    }

    public void setExchange(ServiceUrls exchange) {
        this.exchange = exchange;
    }

    public ServiceUrls getSalary() {
        return salary;
    }

    public void setSalary(ServiceUrls salary) {
        this.salary = salary;
    }
}