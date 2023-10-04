package inpeace.userservice.controller;

import inpeace.userservice.dto.BookmarkedPlaceDTO;
import inpeace.userservice.dto.BookmarkedPostDTO;
import inpeace.userservice.exception.UserNotAuthorizedException;
import inpeace.userservice.service.BookmarksService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookmarkController {

    private final BookmarksService bookmarksService;
    private final ControllerUtils controllerUtils;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    public BookmarkController(BookmarksService bookmarksService, ControllerUtils controllerUtils) {
        this.controllerUtils = controllerUtils;
        this.bookmarksService = bookmarksService;
    }

    @PostMapping("/{userID}/bookmark-place")
    public ResponseEntity<?> bookmarkPlace(@RequestBody String placeID, @PathVariable Long userID, @RequestHeader("Authorization") String bearerToken) {
        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            bookmarksService.bookmarkPlace(userID, placeID, requestUserID);
            logger.info("Place bookmarked successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Place bookmarked successfully"));
        } catch (UserNotAuthorizedException e) {
            logger.error("Failed to bookmark place: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception ex) {
            logger.error("Failed to bookmark place: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to bookmark place, " + ex.getMessage()));
        }
    }

    @DeleteMapping("/{userID}/remove-bookmark-place/{placeID}")
    public ResponseEntity<?> removeBookmarkPlace(@PathVariable Long userID, @PathVariable String placeID, @RequestHeader("Authorization") String bearerToken) {
        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            bookmarksService.removeBookmarkPlace(userID, placeID, requestUserID);
            logger.info("Removed place bookmark successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Removed place bookmark successfully"));
        } catch (UserNotAuthorizedException e) {
            logger.error("Failed to remove place bookmark: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception ex) {
            logger.error("Failed to remove place bookmark: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to remove place bookmark"));
        }
    }

    @GetMapping("/{userID}/bookmark-places")
    public ResponseEntity<?> getUserBookmarkPlaces(@PathVariable Long userID, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            List<BookmarkedPlaceDTO> bookmarkedPlaces = bookmarksService.getAllUserBookmarkPlaces(userID, requestUserID);
            logger.info("Retrieved bookmarked places successfully.");
            return ResponseEntity.ok(bookmarkedPlaces);
        } catch (UserNotAuthorizedException e) {
            logger.error("Failed to get bookmarked places: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception ex) {
            logger.error("No bookmarked places found: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No bookmarked places found"));
        }
    }

    @PostMapping("/{userID}/bookmark-post")
    public ResponseEntity<?> bookmarkPost(@RequestBody Long postID, @PathVariable Long userID, @RequestHeader("Authorization") String bearerToken) {
        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            bookmarksService.bookmarkPost(userID, postID, requestUserID);
            logger.info("Post bookmarked successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Post bookmarked successfully"));
        } catch (UserNotAuthorizedException e) {
            logger.error("Failed to bookmark post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception ex) {
            logger.error("Failed to bookmark post: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to bookmark post"));
        }
    }

    @DeleteMapping("/{userID}/remove-bookmark-post/{postID}")
    public ResponseEntity<?> removeBookmarkPost(@PathVariable Long userID, @PathVariable Long postID, @RequestHeader("Authorization") String bearerToken) {
        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            bookmarksService.removeBookmarkPost(userID, postID, requestUserID);
            logger.info("Removed post bookmark successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Removed post bookmark successfully"));
        } catch (UserNotAuthorizedException e) {
            logger.error("Failed to remove bookmarked post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception ex) {
            logger.error("Failed to remove post bookmark: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to remove post bookmark"));
        }
    }

    @GetMapping("/{userID}/bookmark-posts")
    public ResponseEntity<?> getUserBookmarkPosts(@PathVariable Long userID, @RequestHeader("Authorization") String bearerToken) {
        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            List<BookmarkedPostDTO> bookmarkedPosts = bookmarksService.getAllUserBookmarkPosts(userID, requestUserID);
            logger.info("Retrieved bookmarked posts successfully.");
            return ResponseEntity.ok(bookmarkedPosts);
        } catch (UserNotAuthorizedException e) {
            logger.error("Failed to get bookmarked posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse(e.getMessage()));
        } catch (Exception ex) {
            logger.error("No bookmarked posts found: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No bookmarked posts found"));
        }
    }
}
