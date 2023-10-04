package inpeace.communityservice.controller;

import inpeace.communityservice.dto.PostDTO;
import inpeace.communityservice.exception.PostNotFoundException;
import inpeace.communityservice.exception.UserNotAuthorizedException;
import inpeace.communityservice.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PostsController {

    private final PostService postService;
    private final Logger logger = LoggerFactory.getLogger(PostsController.class);
    private final ControllerUtils controllerUtils;

    public PostsController(PostService postService, ControllerUtils controllerUtils) {
        this.postService = postService;
        this.controllerUtils = controllerUtils;
    }

    @GetMapping("/")
    public String hello() {
        return "Hello from the Community Service!";
    }

    @PostMapping("/post")
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            postService.createPost(postDTO, requestUserID);
            logger.info("Post created successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Post created successfully"));
        }
        catch (UserNotAuthorizedException e){
            logger.error("Failed to create post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e) {
            logger.error("Failed to create post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to create post."));
        }
    }

    @GetMapping("/posts/{postID}")
    public ResponseEntity<?> getPostByID(@PathVariable Long postID) {
        try {
            // TODO: Figure out pagination so that we can control the number of posts being returned
            PostDTO post = postService.getPostByID(postID);
            logger.info("No post found with postID: " + postID);
            return ResponseEntity.ok(post);
        } catch (PostNotFoundException e) {
            logger.error("Failed to create post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error while fetching post with postID: " + postID +  e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(controllerUtils.getErrorResponse("Error while fetching post with postID: " + postID));
        }
    }

    @PostMapping("/posts")
    public ResponseEntity<?> getPostsByIDList(@RequestBody List<Long> postIDs) {
        List<PostDTO> posts = new ArrayList<>();
        Map<String, String> response = new HashMap<>();

        for (Long postID : postIDs) {
            try {
                PostDTO post = postService.getPostByID(postID);
                posts.add(post);
                logger.info("Post found with postID: " + postID);
            } catch (PostNotFoundException e) {
                logger.error("Post not found with postID: " + postID + ", " + e.getMessage());
                response.put("postID: " + postID, "Not Found");
            } catch (Exception e) {
                logger.error("Error while fetching post with postID: " + postID + ", " + e.getMessage());
                response.put("postID: " + postID, "Error while fetching");
            }
        }

        if (!posts.isEmpty()) {
            return ResponseEntity.ok(posts);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorMapResponse(response));
        }
    }

    @GetMapping("/posts/date/{date}")
    public ResponseEntity<?> getPostsForDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            // TODO: Figure out pagination so that we can control the number of posts being returned
            List<PostDTO> postsForDate = postService.getPostsForDate(date);
            if (postsForDate.isEmpty()) {
                logger.warn("No posts found for date " + date);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No posts found for date " + date));
            }
            logger.info("Returning posts for date: " + date);
            return ResponseEntity.ok(postsForDate);
        } catch (Exception e) {
            logger.error("Error while fetching posts for date " + date + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(controllerUtils.getErrorResponse("Error while fetching posts for date " + date));
        }
    }

    @GetMapping("/posts/recent/{limit}")
    public ResponseEntity<?> getRecentPosts(@PathVariable Integer limit) {
        try {
            List<PostDTO> recentPosts = postService.getRecentPosts(limit);
            if (recentPosts.isEmpty()) {
                logger.warn("No posts found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No posts found"));
            }
            logger.info("Returning recent posts.");
            return ResponseEntity.ok(recentPosts);
        } catch (Exception e) {
            logger.error("Error while fetching recent posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(controllerUtils.getErrorResponse("Error while fetching recent posts."));
        }
    }

    @GetMapping("/posts/place/{placeID}")
    public ResponseEntity<?> getPostsForPlace(@PathVariable String placeID) {
        try {
            // TODO: Figure out pagination so that we can control the number of posts being returned
            List<PostDTO> postsForPlace = postService.getPostsForPlace(placeID);
            if (postsForPlace.isEmpty()) {
                logger.warn("No posts found for place " + placeID);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No posts found for place " + placeID));
            }
            logger.info("Returning posts for place: " + placeID);
            return ResponseEntity.ok(postsForPlace);
        }
        catch (Exception e) {
            logger.error("Error while fetching posts for place " + placeID + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(controllerUtils.getErrorResponse("Error while fetching posts for place " + placeID));
        }
    }

    @PutMapping("/posts/{postID}")
    public ResponseEntity<?> updatePost(@PathVariable Long postID, @RequestBody PostDTO postDTO, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            postService.updatePost(postID, postDTO, requestUserID);
            logger.info("Post updated successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Post updated successfully"));
        }
        catch (UserNotAuthorizedException e){
            logger.error("Failed to update post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e) {
            logger.error("Failed to update post with ID " + postID + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to update post."));
        }
    }

    @DeleteMapping("/posts/{postID}")
    public ResponseEntity<?> deletePost(@PathVariable Long postID,  @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);
        try {
            postService.deletePost(postID, requestUserID);
            logger.info("Post deleted successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Post deleted successfully"));
        }
        catch (UserNotAuthorizedException e){
            logger.error("Failed to delete post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e) {
            logger.error("Failed to delete post with ID " + postID + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to delete post."));
        }
    }

}
