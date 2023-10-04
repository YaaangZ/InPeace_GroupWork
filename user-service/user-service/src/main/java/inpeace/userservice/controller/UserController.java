package inpeace.userservice.controller;

import inpeace.userservice.dto.BookmarkedPlaceDTO;
import inpeace.userservice.dto.BookmarkedPostDTO;
import inpeace.userservice.dto.PublicUserProfileDTO;
import inpeace.userservice.dto.UserProfileDTO;
import inpeace.userservice.exception.UserNotAuthorizedException;
import inpeace.userservice.exception.UserNotFoundException;
import inpeace.userservice.model.User;
import inpeace.userservice.service.BookmarksService;
import inpeace.userservice.service.ConversionPreferenceService;
import inpeace.userservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;
    private final ControllerUtils controllerUtils;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);



    public UserController (UserService userService, BookmarksService bookmarksService, ControllerUtils controllerUtils) {
        this.userService = userService;
        this.controllerUtils = controllerUtils;
    }

    @GetMapping("/")
    public ResponseEntity<?> hello() {
        return ResponseEntity.ok(controllerUtils.getSuccessResponse("Hello from the User Service"));
    }

    @PutMapping("/update/{userID}")
    public ResponseEntity<?> update(@RequestBody UserProfileDTO userProfileDTO, @PathVariable Long userID, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            userService.updateUser(userID, userProfileDTO, requestUserID);
            logger.info("User updated successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("Successfully updated user details."));
        }
        catch (UserNotAuthorizedException e){
            logger.error("Not authorized to update user profile information: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse("Not authorized to update user profile."));
        }
        catch (IllegalArgumentException e){
            logger.error("User attempted to create a bio greater than 140 characters long: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("User bios should not exceed 140 characters."));
        }
        catch (Exception e) {
            logger.error("Could not find user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("Could not find user profile."));
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            UserProfileDTO userProfileDTO = userService.getUserByID(userId, requestUserID);
            return ResponseEntity.ok(userProfileDTO);
        }
        catch (UserNotAuthorizedException e){
            logger.error("Not authorized to get user information: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse("User not authorized to get user profile."));
        }
        catch (Exception e) {
            logger.error("Could not find user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("Could not find user profile."));
        }
    }

    @GetMapping("/public-profiles")
    public ResponseEntity<?> getAllPublicProfiles(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            List<PublicUserProfileDTO> allPublicUsers;
            if (bearerToken != null) {
                Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);
                allPublicUsers = userService.getAllPublicUserProfilesExceptAuthenticated(requestUserID);
            } else {
                allPublicUsers = userService.getAllPublicUserProfiles();
            }
            return ResponseEntity.ok(allPublicUsers);
        } catch (Exception e) {
            logger.error("Failed to get public user information: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to get public user information"));
        }
    }

    @GetMapping("/public-profile/{username}")
    public ResponseEntity<?> getPublicUserProfileByUsername(@PathVariable String username) {
        try {
            PublicUserProfileDTO publicUserProfileDTO = userService.getPublicUserByUsername(username);
            return ResponseEntity.ok(publicUserProfileDTO);
        } catch (UserNotFoundException e) {
            logger.error("User not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("User not found"));
        } catch (Exception e) {
            logger.error("Failed to get user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to get user profile"));
        }
    }


    @DeleteMapping("/profile/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id, @RequestHeader("Authorization") String bearerToken) {

        Long requestUserID = controllerUtils.getUserIDFromBearer(bearerToken);

        try {
            userService.deleteUserByID(id, requestUserID);
            logger.info("User deleted successfully.");
            return ResponseEntity.ok(controllerUtils.getSuccessResponse("User profile deleted successfully."));
        }
        catch (UserNotAuthorizedException e){
            logger.error("Not authorized to delete user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(controllerUtils.getErrorResponse("User not authorized to delete profile."));
        }
        catch (Exception e) {
            logger.error("Failed to delete profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("User not found."));
        }
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> getAllProfiles() {
        try {
            List<UserProfileDTO> allUsers = userService.getAllUsers();
            return ResponseEntity.ok(allUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(controllerUtils.getErrorResponse("Failed to get user information"));
        }
    }

}
