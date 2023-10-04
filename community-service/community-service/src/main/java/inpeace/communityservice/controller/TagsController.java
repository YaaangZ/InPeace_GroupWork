package inpeace.communityservice.controller;

import inpeace.communityservice.dto.PostDTO;
import inpeace.communityservice.dto.TagListDTO;
import inpeace.communityservice.exception.UserNotAuthorizedException;
import inpeace.communityservice.service.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TagsController {

    private final TagService tagService;
    private final Logger logger = LoggerFactory.getLogger(TagsController.class);
    private final ControllerUtils controllerUtils;

    public TagsController(TagService tagService, ControllerUtils controllerUtils){
        this.tagService = tagService;
        this.controllerUtils = controllerUtils;
    }

    @GetMapping("/tags")
    public ResponseEntity<?> getAllTags(){
        try{
            List<String> allTags = tagService.getAllTags();
            return ResponseEntity.ok(allTags);
        }
        catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tags found");
        }
    }

    @GetMapping("/posts/{postID}/tags")
    public ResponseEntity<?> getAllTagsForPost(@PathVariable Long postID){
        try{
            List<String> allTags = tagService.getAllTagsForPost(postID);
            return ResponseEntity.ok(allTags);
        }
        catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tags found");
        }
    }

    @PatchMapping("/posts/{postID}/tags")
    public ResponseEntity<?> addTagsToPost(@PathVariable Long postID, @RequestBody TagListDTO tags, @RequestHeader("Authorization") String bearerToken){

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try{
            tagService.addTagsToPost(postID, tags.getTags(), requestUserID);
            return ResponseEntity.ok("Tag added successfully.");
        }
        catch (UserNotAuthorizedException e) {
            logger.error("Failed to add tags to post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e){
            logger.error("Failed to add tags to post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("Failed to agg tags to post."));
        }
    }

    @DeleteMapping("/posts/{postID}/tag")
    public ResponseEntity<?> removeTagsFromPost(@PathVariable Long postID, @RequestBody TagListDTO tags,  @RequestHeader("Authorization") String bearerToken){

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);
        try{
            tagService.removeTagsFromPost(postID, tags.getTags(), requestUserID);
            return ResponseEntity.ok("Tags removed successfully");
        }
        catch (UserNotAuthorizedException e) {
            logger.error("Failed to remove tags from post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e){
            logger.error("Failed to remove tags from post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("Failed to remove tags from post."));
        }
    }

    @DeleteMapping("/posts/{postID}/tags")
    public ResponseEntity<?> removeAllTagsFromPost(@PathVariable Long postID, @RequestHeader("Authorization") String bearerToken){

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);
        try{
            tagService.removeAllTagsFromPost(postID, requestUserID);
            return ResponseEntity.ok("Tags removed successfully");
        }
        catch (UserNotAuthorizedException e) {
            logger.error("Failed to remove tags from post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e){
            logger.error("Failed to remove tags from post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("Failed to remove tags from post."));
        }
    }

    @GetMapping("/posts/tags")
    public ResponseEntity<?> getPostsForTags(@RequestParam List<String> tags){
        // TODO Figure out pagination so that we can control the number of posts being returned
        try {
            List<PostDTO> postFromTags = tagService.getPostsForTags(tags);
            return ResponseEntity.ok(postFromTags);
        }
        catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No posts found with tags " + tags);
        }
    }

}
