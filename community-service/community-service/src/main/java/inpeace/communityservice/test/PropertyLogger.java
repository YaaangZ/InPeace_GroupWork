package inpeace.communityservice.test;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class PropertyLogger {

    public PropertyLogger(Environment environment) {
        System.out.println("spring.datasource.url=" + environment.getProperty("spring.datasource.url"));
        System.out.println("spring.datasource.username=" + environment.getProperty("spring.datasource.username"));
        System.out.println("spring.datasource.password=" + environment.getProperty("spring.datasource.password"));
    }
}
