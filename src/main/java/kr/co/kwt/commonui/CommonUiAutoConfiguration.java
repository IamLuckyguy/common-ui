package kr.co.kwt.commonui;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.util.List;

@Configuration
@AutoConfiguration
public class CommonUiAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public SpringResourceTemplateResolver commonUiTemplateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setPrefix("classpath:/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding("UTF-8");
        resolver.setOrder(2); // 공통 UI 템플릿을 후순위 탐색
        resolver.setCheckExistence(true);
        return resolver;
    }

    @Bean
    @ConditionalOnMissingBean
    public SpringTemplateEngine templateEngine(List<ITemplateResolver> templateResolvers) {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        templateResolvers.forEach(engine::addTemplateResolver);
        engine.setEnableSpringELCompiler(true);
        return engine;
    }
}
