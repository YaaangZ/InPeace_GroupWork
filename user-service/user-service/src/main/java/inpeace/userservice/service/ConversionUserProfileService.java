package inpeace.userservice.service;

import inpeace.userservice.dao.UserAccessibilityNeedRepository;
import inpeace.userservice.dao.UserAmenityNeedRepository;
import inpeace.userservice.dao.UserRepository;
import inpeace.userservice.dto.PublicUserProfileDTO;
import inpeace.userservice.dto.UserProfileDTO;
import inpeace.userservice.exception.AvatarNotFoundException;
import inpeace.userservice.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ConversionUserProfileService {

    private final ConversionPreferenceService conversionPreferenceService;
    private final UserAmenityNeedRepository userAmenityNeedRepository;
    private final UserAccessibilityNeedRepository userAccessibilityNeedRepository;
    private final UserRepository userRepository;

    public ConversionUserProfileService(ConversionPreferenceService conversionPreferenceService,
                                        UserAmenityNeedRepository userAmenityNeedRepository,
                                        UserAccessibilityNeedRepository userAccessibilityNeedRepository,
                                        UserRepository userRepository){
        this.conversionPreferenceService = conversionPreferenceService;
        this.userAmenityNeedRepository = userAmenityNeedRepository;
        this.userAccessibilityNeedRepository = userAccessibilityNeedRepository;
        this.userRepository = userRepository;
    }


    public User convertToUser(UserProfileDTO userProfileDTO){

        User user = new User();

        if (userProfileDTO.getEmailAddress() != null){
            user.setEmailAddress(userProfileDTO.getEmailAddress());
        }

        if (userProfileDTO.getUsername() != null) {
            user.setUsername(userProfileDTO.getUsername());
        }

        if (userProfileDTO.getBio() != null) {
            user.setBio(userProfileDTO.getBio());
        }

        if (userProfileDTO.getAvatar() != null) {
            System.out.println("Avatar ID from DTO: " + userProfileDTO.getAvatar());
            try {
                Long id = Long.parseLong(userProfileDTO.getAvatar());
                Avatar avatar = conversionPreferenceService.convertToAvatar(id);
                user.setAvatar(avatar);
            } catch (NumberFormatException nfe) {
                throw new AvatarNotFoundException("Invalid format for Avatar ID" + nfe);
            }
        }

        if (userProfileDTO.getPreferredCategory() != null) {
            user.setPreferredCategory(conversionPreferenceService.convertToPlaceCategory(userProfileDTO.getPreferredCategory()));
        }

        if (userProfileDTO.getPreferredBusyness() != null) {
            user.setPreferredBusyness(conversionPreferenceService.convertToBusyness(userProfileDTO.getPreferredBusyness()));
        }

        if (userProfileDTO.getPreferredIndoorOutdoor() != null) {
            user.setPreferredIndoorOutdoor(conversionPreferenceService.convertToIndoorOutdoor(userProfileDTO.getPreferredIndoorOutdoor()));
        }

        if (userProfileDTO.getMyersBriggsType() != null) {
            user.setMyersBriggsType(conversionPreferenceService.convertToMyersBriggsType(userProfileDTO.getMyersBriggsType()));
        }

        user.setDateUpdated(LocalDateTime.now());
        user = userRepository.save(user);

        if (userProfileDTO.getAccessibilityNeeds() != null){
            for (String accessibilityNeedString : userProfileDTO.getAccessibilityNeeds()){
                AccessibilityNeed accessibilityNeed = conversionPreferenceService.convertToAccessibility(accessibilityNeedString);
                UserAccessibilityNeed userAccessibilityNeed = new UserAccessibilityNeed();
                userAccessibilityNeed.setId(new UserAccessibilityNeedID(user.getUserID(), accessibilityNeed.getAccessibilityID()));
                userAccessibilityNeedRepository.save(userAccessibilityNeed);
            }
        }

        if (userProfileDTO.getAmenityNeeds() != null){
            for (String amenityNeedString : userProfileDTO.getAmenityNeeds()){
                AmenityNeed amenityNeed = conversionPreferenceService.convertToAmenity(amenityNeedString);
                UserAmenityNeed userAmenityNeed = new UserAmenityNeed();
                userAmenityNeed.setId(new UserAmenityNeedID(user.getUserID(), amenityNeed.getAmenityID()));
                userAmenityNeedRepository.save(userAmenityNeed);
            }
        }

        return user;

    }

    public UserProfileDTO convertToUserProfileDTO(User user) {
        UserProfileDTO userProfileDTO = new UserProfileDTO();

        if (user.getEmailAddress() != null) {
            userProfileDTO.setEmailAddress(user.getEmailAddress());
        }

        if (user.getBio() != null) {
            userProfileDTO.setBio(user.getBio());
        }

        if (user.getUsername() != null) {
            userProfileDTO.setUsername(user.getUsername());
        }

        if (user.getAvatar() != null){
            userProfileDTO.setAvatar(user.getAvatar().getSvg());
        }

        if (user.getPreferredCategory() != null) {
            userProfileDTO.setPreferredCategory(conversionPreferenceService.convertToPlaceCategoryString(user.getPreferredCategory()));
        }

        if (user.getPreferredBusyness() != null) {
            userProfileDTO.setPreferredBusyness(conversionPreferenceService.convertToBusynessString(user.getPreferredBusyness()));
        }

        if (user.getPreferredIndoorOutdoor() != null){
            userProfileDTO.setPreferredIndoorOutdoor(conversionPreferenceService.convertToIndoorOutdoorString(user.getPreferredIndoorOutdoor()));
        }

        if (user.getMyersBriggsType() != null){
            userProfileDTO.setMyersBriggsType(conversionPreferenceService.convertToMyersBriggsTypeString(user.getMyersBriggsType()));
        }

        List<AmenityNeed> amenityNeeds = user.getAmenityNeeds();
        List<String> amenityNeedStrings = new ArrayList<>();
        for (AmenityNeed amenityNeed : amenityNeeds){
            String amenityNeedString = conversionPreferenceService.convertToAmenityString(amenityNeed);
            amenityNeedStrings.add(amenityNeedString);
        }
        userProfileDTO.setAmenityNeeds(amenityNeedStrings);

        List<AccessibilityNeed> accessibilityNeeds = user.getAccessibilityNeeds();
        List<String> accessibilityNeedStrings = new ArrayList<>();
        for (AccessibilityNeed accessibilityNeed : accessibilityNeeds){
            String accessibilityNeedString = conversionPreferenceService.convertToAccessibilityString(accessibilityNeed);
            accessibilityNeedStrings.add(accessibilityNeedString);
        }
        userProfileDTO.setAccessibilityNeeds(accessibilityNeedStrings);

        return userProfileDTO;
    }

    public PublicUserProfileDTO convertToPublicUserProfileDTO(User user) {
        PublicUserProfileDTO publicUserProfileDTO = new PublicUserProfileDTO();

        if (user.getUsername() != null) {
            publicUserProfileDTO.setUsername(user.getUsername());
        }

        if (user.getBio() != null) {
            publicUserProfileDTO.setBio(user.getBio());
        }

        if (user.getAvatar() != null){
            publicUserProfileDTO.setAvatar(user.getAvatar().getSvg());
        }

        if (user.getMyersBriggsType() != null){
            publicUserProfileDTO.setMyersBriggsType(conversionPreferenceService.convertToMyersBriggsTypeString(user.getMyersBriggsType()));
        }

        return publicUserProfileDTO;
    }


}
