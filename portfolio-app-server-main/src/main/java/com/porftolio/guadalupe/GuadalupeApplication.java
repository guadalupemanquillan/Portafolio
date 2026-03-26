package com.porftolio.guadalupe;

import com.porftolio.guadalupe.config.ApplicationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ApplicationProperties.class)
public class GuadalupeApplication {

	public static void main(String[] args) {
		SpringApplication.run(GuadalupeApplication.class, args);
	}

}
