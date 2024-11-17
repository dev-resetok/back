package com.app.back.configuration;

import com.app.back.interceptor.AlarmInterceptor;
import com.app.back.interceptor.MoveInterceptor;
import com.app.back.service.alarm.AlarmService;
import com.app.back.service.volunteer.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig  implements WebMvcConfigurer {
    private final AlarmService alarmService;
    private final VolunteerService volunteerService;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/main/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/mypage/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/volunteer/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/support/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/donation/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/review/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/help/**");
        registry.addInterceptor(new AlarmInterceptor(alarmService)).addPathPatterns("/rank/**");

        registry.addInterceptor(new MoveInterceptor(volunteerService)).addPathPatterns("/volunteer/volunteer-write/**");
        registry.addInterceptor(new MoveInterceptor(volunteerService)).addPathPatterns("/support/support-write/**");

    }
}
