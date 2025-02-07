package kr.co.kwt.commonui;

import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;

@AutoConfiguration(after = {
        ThymeleafAutoConfiguration.class
})
@EnableConfigurationProperties(ServiceProperties.class)
public class CommonUiAutoConfiguration {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/css/**")
                        .addResourceLocations("classpath:/static/css/");
            }
        };
    }

    @Bean
    public ServiceConfig serviceConfig(
            ServiceProperties serviceProperties,
            @Value("${app.service:}") String currentServiceId
    ) {
        return new ServiceConfig(serviceProperties, currentServiceId);
    }

    @Bean
    @ConditionalOnMissingBean(name = "commonUiTemplateResolver")
    public SpringResourceTemplateResolver commonUiTemplateResolver(
            ApplicationContext applicationContext
    ) {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setApplicationContext(applicationContext);
        resolver.setPrefix("classpath:/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setOrder(1);
        resolver.setCheckExistence(true);
        resolver.setCacheable(false);
        return resolver;
    }

    @Bean
    @ConditionalOnMissingBean(name = "commonUiTemplateEngine")
    public SpringTemplateEngine commonUiTemplateEngine(
            SpringResourceTemplateResolver commonUiTemplateResolver
    ) {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.addTemplateResolver(commonUiTemplateResolver);
        engine.setEnableSpringELCompiler(true);
        engine.addDialect(new LayoutDialect());

        return engine;
    }
}
