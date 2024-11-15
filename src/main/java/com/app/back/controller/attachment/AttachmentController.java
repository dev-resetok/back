
package com.app.back.controller.attachment;

import com.app.back.domain.attachment.AttachmentDTO;
import com.app.back.domain.attachment.AttachmentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/attachment/*")
@Slf4j
public class AttachmentController {

    @PostMapping("upload")
    @ResponseBody
    public AttachmentDTO upload(@RequestParam("file")List<MultipartFile> files) throws IOException {
//        String rootPath = "D:/dev/OnjungSpring/back/src/main/resources/static/files" + getPath();
        String rootPath = "C:/upload/" + getPath();
        log.info("{}",files.size());

        AttachmentDTO attachmentDTO = new AttachmentDTO();
        UUID uuid = UUID.randomUUID();

        attachmentDTO.setAttachmentFilePath(getPath());

        File directory = new File(rootPath);
        if(!directory.exists()){
            directory.mkdirs();
        }

        for(int i=0; i<files.size(); i++){
            files.get(i).transferTo(new File(rootPath, uuid.toString() + "_" + files.get(i).getOriginalFilename()));
            attachmentDTO.setAttachmentFileName(uuid.toString() + "_" + files.get(i).getOriginalFilename());
            attachmentDTO.setAttachmentFileSize(String.valueOf(files.get(i).getSize()));

            if(files.get(i).getContentType().startsWith("image")){
                FileOutputStream fileOutputStream = new FileOutputStream(new File(rootPath, "t_" + uuid.toString() + "_" + files.get(i).getOriginalFilename()));
                Thumbnailator.createThumbnail(files.get(i).getInputStream(), fileOutputStream, 100, 100);
                fileOutputStream.close();
            }
        }

        return attachmentDTO;
    }

    private String getPath(){
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    }

    //    가져오기
    @GetMapping("display")
    @ResponseBody
    public byte[] display(String attachmentFileName) throws IOException{
        return FileCopyUtils.copyToByteArray(new File("C:/upload", attachmentFileName));
    }

//    다운로드
//    REST방식이 아닌 ViewResolver 방식으로 사용해야 한다.
    @GetMapping("download")
    public ResponseEntity<Resource> download(String fileName) throws IOException {
        Resource resource = new FileSystemResource("C:/upload/" + fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attchment; filename=" + new String(("한동석짱_" + fileName.substring(fileName.indexOf("_") + 1)).getBytes("UTF-8"), "ISO-8859-1"));
        return new ResponseEntity<Resource>(resource, headers, HttpStatus.OK);
    }

}
