package inpeace.communityservice.controller;

import inpeace.communityservice.dto.CommentDTO;
import inpeace.communityservice.exception.UserNotAuthorizedException;
import inpeace.communityservice.security.JWTService;
import inpeace.communityservice.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CommentsController {

    private final CommentService commentService;
    private final ControllerUtils controllerUtils;

    public CommentsController(CommentService commentService, ControllerUtils controllerUtils){
        this.commentService = commentService;
        this.controllerUtils = controllerUtils;
    }

    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestBody CommentDTO commentDTO, @RequestHeader("Authorization") String bearerToken){

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            commentService.createComment(commentDTO, requestUserID);
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Comment created successfully."));
        }
        catch (UserNotAuthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to create comment."));
        }
    }

    @GetMapping("/post/{postID}/comments")
    public ResponseEntity<?> getCommentsForPost(@PathVariable Long postID ){
        try {
            List<CommentDTO> commentsForPost = commentService.getCommentsForPost(postID);
            return ResponseEntity.ok(commentsForPost);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No comments found for postID " + postID));
        }
    }

    @PutMapping("/comment/{commentID}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentID, @RequestBody CommentDTO commentDTO, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            commentService.updateComment(commentID, commentDTO, requestUserID);
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Comment updated successfully"));
        }
        catch (UserNotAuthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse("User not authorized to update comment."));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to update comment."));
        }
    }

    @DeleteMapping("/comment/{commentID}")
    public ResponseEntity<?>deleteComment(@PathVariable Long commentID, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            commentService.deleteComment(commentID, requestUserID);
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Comment deleted successfully"));
        }
        catch (UserNotAuthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse("User not authorized to delete comment."));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to delete comment."));
        }
    }

}
