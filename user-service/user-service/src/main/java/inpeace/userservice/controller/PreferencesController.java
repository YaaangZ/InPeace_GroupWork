package inpeace.userservice.controller;

import inpeace.userservice.dto.AvatarDTO;
import inpeace.userservice.dto.MyersBriggsTypeDTO;
import inpeace.userservice.service.PreferencesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PreferencesController {

    private final PreferencesService preferencesService;
    private final ControllerUtils controllerUtils;
    private final Logger logger = LoggerFactory.getLogger(PreferencesController.class);

    public PreferencesController(PreferencesService preferencesService, ControllerUtils controllerUtils) {
        this.preferencesService = preferencesService;
        this.controllerUtils = controllerUtils;
    }

    @GetMapping("/preferences/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<String> allCategories = preferencesService.getAllCategories();
            logger.info("Retrieved all categories successfully.");
            return ResponseEntity.ok(allCategories);
        } catch (Exception e) {
            logger.error("Failed to retrieve categories: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No categories found"));
        }
    }

    @GetMapping("/preferences/busyness-levels")
    public ResponseEntity<?> getAllBusynessLevels() {
        try {
            List<String> allBusynessLevels = preferencesService.getAllBusynessLevels();
            logger.info("Retrieved all busyness levels successfully.");
            return ResponseEntity.ok(allBusynessLevels);
        } catch (Exception e) {
            logger.error("Failed to retrieve busyness levels: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No busyness levels found"));
        }
    }

    @GetMapping("/preferences/amenity-needs")
    public ResponseEntity<?> getAllAmenityNeeds() {
        try {
            List<String> allAmenityNeeds = preferencesService.getAllAmenityNeeds();
            logger.info("Retrieved all amenity needs successfully.");
            return ResponseEntity.ok(allAmenityNeeds);
        } catch (Exception e) {
            logger.error("Failed to retrieve amenity needs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No amenity needs found"));
        }
    }

    @GetMapping("/preferences/accessibility-needs")
    public ResponseEntity<?> getAllAccessibilityNeeds() {
        try {
            List<String> allAccessibilityNeeds = preferencesService.getAllAccessibilityNeeds();
            logger.info("Retrieved all accessibility needs successfully.");
            return ResponseEntity.ok(allAccessibilityNeeds);
        } catch (Exception e) {
            logger.error("Failed to retrieve accessibility needs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No accessibility needs found"));
        }
    }

    @GetMapping("/preferences/avatars")
    public ResponseEntity<?> getAllAvatars() {
        try {
            List<AvatarDTO> allAvatars = preferencesService.getAllAvatars();
            logger.info("Retrieved all avatars successfully.");
            return ResponseEntity.ok(allAvatars);
        } catch (Exception e) {
            logger.error("Failed to retrieve avatars: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No avatars found"));
        }
    }

    @GetMapping("/preferences/mbti")
    public ResponseEntity<?> getAllMyersBriggsPersonalities() {
        try {
            List<MyersBriggsTypeDTO> allMyersBriggsPersonalities = preferencesService.getAllMyersBriggsPersonalities();
            logger.info("Retrieved all Myers Briggs Personalities successfully.");
            return ResponseEntity.ok(allMyersBriggsPersonalities);
        } catch (Exception e) {
            logger.error("Failed to retrieve Myers Briggs Personalities: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No Myers Briggs Personalities found"));
        }
    }

    @GetMapping("/preferences/indoor-outdoor")
    public ResponseEntity<?> getAllIndoorOutdoorPreferences() {
        try {
            List<String> allIndoorOutdoorPreferences = preferencesService.getAllIndoorOutdoorPreferences();
            logger.info("Retrieved all indoor/outdoor preferences successfully.");
            return ResponseEntity.ok(allIndoorOutdoorPreferences);
        } catch (Exception e) {
            logger.error("Failed to retrieve indoor/outdoor preferences: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(controllerUtils.getErrorResponse("No indoor/outdoor preferences found"));
        }
    }

}
