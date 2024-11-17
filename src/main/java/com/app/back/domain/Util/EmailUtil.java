package com.app.back.domain.Util;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.Date;
import java.util.Properties;
import java.util.Random;

@Component
public class EmailUtil {

    private final String username = "ljm21000@gmail.com";
    private final String password = "okrw hhxj chga wglt";

    // 6자리 랜덤 인증번호 생성
    public String generateAuthCode() {
        Random random = new Random();
        StringBuilder authCode = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            authCode.append(random.nextInt(10)); // 0~9 사이의 숫자 생성
        }
        return authCode.toString();
    }

    // 인증번호 이메일 발송 메서드
    public void sendAuthEmail(String toEmail, String authCode) throws MessagingException, UnsupportedEncodingException {
        Properties props = getMailProperties();

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username, "Onjung"));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("인증번호 발송");
        message.setSentDate(new Date());

        // 인증번호 포함 본문 작성
        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(
                "<h3>[Onjung] 인증번호는 <strong>" + authCode + "</strong>입니다.</h3>",
                "text/html; charset=UTF-8");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);
        message.setContent(multipart);

        // 이메일 발송
        Transport.send(message);
    }

    // HTML 템플릿 이메일 발송 메서드
    public void sendHtmlEmail(String toEmail, String resetLink) throws MessagingException, UnsupportedEncodingException {
        Properties props = getMailProperties();

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username, "Onjung"));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("비밀번호 재설정 링크");
        message.setSentDate(new Date());

        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(
                "<table style=\"width:100%; border-collapse: collapse !important; background-color:#fff;\">\n" +
                        "  <tbody>\n" +
                        "    <tr>\n" +
                        "      <td style=\"border:0; padding-bottom:60px;\">\n" +
                        "        <table style=\"width:100%; max-width:500px; border-collapse: collapse !important; margin:0 auto;\">\n" +
                        "          <tbody>\n" +
                        "            <tr>\n" +
                        "              <td style=\"font-family:Apple SD Gothic Neo,sans-serif,'맑은고딕',Malgun Gothic,'굴림',gulim; padding-top:120px; padding-bottom:23px; border-bottom:2px solid #272727;\">\n" +
                        "                <a href=\"" + resetLink + "\" target=\"_blank\" rel=\"noreferrer noopener\">\n" +
                        "                </a>\n" +
                        "                  <p style=\"font-size: 20px; \">온정 비밀번호 재설정 링크 발송 이메일</p>\n" +
                        "              </td>\n" +
                        "            </tr>\n" +
                        "            <tr>\n" +
                        "              <td style=\"text-align:left; padding-top:60px; padding-bottom:42px; background-color:#fff;\">\n" +
                        "                <table style=\"width:100%; border-collapse: collapse !important;\">\n" +
                        "                  <tbody>\n" +
                        "                    <tr>\n" +
                        "                      <td style=\"width:50%; padding:0 5px 0 0;\">\n" +
                        "                        <h1 style=\"font-size:24px; color:#272727; font-weight:bold;\">비밀번호 변경하기</h1>\n" +
                        "                        <p><strong>" + toEmail + "</strong> 계정의 비밀번호를 재설정 하려면, 아래 ‘비밀번호 재설정’을 클릭해주세요.</p>\n" +
                        "                        <a href=\"" + resetLink + "\" target=\"_blank\" style=\"display:inline-block; margin:0; padding:16px 0; font-size:16px; color:#fff; background-color:#000; text-align:center; text-decoration:none;\">\n" +
                        "                          <div style=\"min-width:200px; width:50%;\">비밀번호 재설정</div>\n" +
                        "                        </a>\n" +
                        "                        <p style=\"padding-top:20px; font-size:12px; color:#666;\">인증 시간이 만료되었을 경우, 인증번호 재발송을 진행해 주시기 바랍니다.<br>\n" +
                        "                        <p style=\"border-bottom:1px solid #d3d6dd; font-size:12px; color:#666;\"><strong>* 비밀번호 변경 관련 문제가 발생하면 ljm21000@gmail.com 로 문의해주세요.</strong></p>\n" +
                        "                        <a href=\"" + resetLink + "\" target=\"_blank\" style=\"margin-right:15px;\" rel=\"noreferrer noopener\">\n" +
                        "                          <img src=\"https://accounts-front.stunning.kr/assets/img/email/img-loud-logo.png\" loading=\"lazy\" style=\"width:87px; height:20px\">\n" +
                        "                        </a>\n" +
                        "                        <a href=\"" + resetLink + "\" target=\"_blank\" style=\"margin-right:15px;\" rel=\"noreferrer noopener\">\n" +
                        "                          <img src=\"https://accounts-front.stunning.kr/assets/img/email/img-nf-logo.png\" loading=\"lazy\" style=\"width:133px; height:18px\">\n" +
                        "                        </a>\n" +
                        "                      </td>\n" +
                        "                    </tr>\n" +
                        "                  </tbody>\n" +
                        "                </table>\n" +
                        "              </td>\n" +
                        "            </tr>\n" +
                        "          </tbody>\n" +
                        "        </table>\n" +
                        "      </td>\n" +
                        "    </tr>\n" +
                        "  </tbody>\n" +
                        "</table>",
                "text/html; charset=UTF-8"
        );


        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);
        message.setContent(multipart);

        // 이메일 발송
        Transport.send(message);
    }



    private Properties getMailProperties() {
        Properties props = new Properties();
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        return props;
    }
}