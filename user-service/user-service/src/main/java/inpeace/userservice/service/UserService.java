package inpeace.userservice.service;

import inpeace.userservice.dao.*;
import inpeace.userservice.dto.PublicUserProfileDTO;
import inpeace.userservice.dto.UserProfileDTO;
import inpeace.userservice.exception.AvatarNotFoundException;

import inpeace.userservice.exception.UserNotAuthorizedException;
import inpeace.userservice.exception.UserNotFoundException;
import inpeace.userservice.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ConversionUserProfileService conversionUserProfileService;
    private final ConversionPreferenceService conversionPreferenceService;

    @Autowired
    public UserService(ConversionPreferenceService conversionPreferenceService, UserRepository userRepository,
                       ConversionUserProfileService conversionUserProfileService) {
        this.userRepository = userRepository;
        this.conversionPreferenceService = conversionPreferenceService;
        this.conversionUserProfileService = conversionUserProfileService;
    }

    public void updateUser(Long userID, UserProfileDTO userProfileDTO, Long requestUserID) {

        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to update user details for this user.");
        }

        User existingUser = userRepository.findByUserID(userID)
                .orElseThrow(() -> new UserNotFoundException("User not found with the provided UserID"));


        if (userProfileDTO.getUsername() != null) {
            existingUser.setUsername(userProfileDTO.getUsername());
        }

        if (userProfileDTO.getBio() != null) {
            if (userProfileDTO.getBio().length() > 140){
                throw new IllegalArgumentException("Bio length should not exceed 140 characters");
            }
            existingUser.setBio(userProfileDTO.getBio());
        }
        else {
            existingUser.setMyersBriggsType(null);
        }

        if (userProfileDTO.getPreferredCategory() != null) {
            PlaceCategory preferredCategory = conversionPreferenceService.convertToPlaceCategory(userProfileDTO.getPreferredCategory());
            existingUser.setPreferredCategory(preferredCategory);
        }
        else {
            existingUser.setPreferredCategory(null);
        }

        if (userProfileDTO.getPreferredBusyness() != null) {
            Busyness busyness = conversionPreferenceService.convertToBusyness(userProfileDTO.getPreferredBusyness());
            existingUser.setPreferredBusyness(busyness);
        }
        else {
            existingUser.setPreferredBusyness(null);
        }

        if (userProfileDTO.getPreferredIndoorOutdoor() != null){
            IndoorOutdoor indoorOutdoor = conversionPreferenceService.convertToIndoorOutdoor(userProfileDTO.getPreferredIndoorOutdoor());
            existingUser.setPreferredIndoorOutdoor(indoorOutdoor);
        }
        else {
            existingUser.setPreferredIndoorOutdoor(null);
        }

        if (userProfileDTO.getMyersBriggsType() != null) {
            MyersBriggsType myersBriggsType = conversionPreferenceService.convertToMyersBriggsType(userProfileDTO.getMyersBriggsType());
            existingUser.setMyersBriggsType(myersBriggsType);
        }
        else {
            existingUser.setMyersBriggsType(null);
        }

        if (userProfileDTO.getAmenityNeeds() != null){
            existingUser.getAmenityNeeds().clear();
            List<AmenityNeed> amenityNeeds = new ArrayList<>();
            for (String need : userProfileDTO.getAmenityNeeds()){
                amenityNeeds.add(conversionPreferenceService.convertToAmenity(need));
            }
            existingUser.getAmenityNeeds().addAll(amenityNeeds);
        }
        else {
            existingUser.getAmenityNeeds().clear();
        }

        if (userProfileDTO.getAccessibilityNeeds() != null){
            existingUser.getAccessibilityNeeds().clear();
            List<AccessibilityNeed> accessibilityNeeds = new ArrayList<>();
            for (String need : userProfileDTO.getAccessibilityNeeds()){
                accessibilityNeeds.add(conversionPreferenceService.convertToAccessibility(need));
            }
            existingUser.getAccessibilityNeeds().addAll(accessibilityNeeds);
        }
        else {
            existingUser.getAccessibilityNeeds().clear();
        }

        if (userProfileDTO.getAvatar() != null){
            try {
                Long id = Long.parseLong(userProfileDTO.getAvatar());
                Avatar avatar = conversionPreferenceService.convertToAvatar(id);
                existingUser.setAvatar(avatar);
            } catch (NumberFormatException nfe) {
                throw new AvatarNotFoundException("Invalid format for Avatar ID" + nfe);
            }
        }
        else {
            existingUser.setAvatar(null);
        }
        existingUser.setDateUpdated(LocalDateTime.now());
        userRepository.save(existingUser); // Saving user with accessibility needs and amenity needs.
    }


    public UserProfileDTO getUserByID(Long userID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to update user details for this user.");
        }
        else {
            User user = userRepository.findByUserID(userID)
                    .orElseThrow(()-> new UserNotFoundException("User not found with the provided email address"));
            return conversionUserProfileService.convertToUserProfileDTO(user);
        }
    }


    public PublicUserProfileDTO getPublicUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with the provided username"));
        return conversionUserProfileService.convertToPublicUserProfileDTO(user);
    }

    public List<PublicUserProfileDTO> getAllPublicUserProfiles() {
        List<User> allUsers = userRepository.findAll();
        List<PublicUserProfileDTO> publicUserProfiles = new ArrayList<>();
        for (User user : allUsers) {
            publicUserProfiles.add(conversionUserProfileService.convertToPublicUserProfileDTO(user));
        }
        return publicUserProfiles;
    }


    public List<PublicUserProfileDTO> getAllPublicUserProfilesExceptAuthenticated(Long requestUserID) {
        List<User> allUsers = userRepository.findAll();
        List<PublicUserProfileDTO> publicUserProfiles = new ArrayList<>();
        for (User user : allUsers) {
            if (!user.getUserID().equals(requestUserID)) {
                publicUserProfiles.add(conversionUserProfileService.convertToPublicUserProfileDTO(user));
            }
        }
        return publicUserProfiles;
    }



    public void deleteUserByID(Long userID, Long requestUserID) {
        User user = userRepository.findById(userID).orElseThrow(
                () -> new UserNotFoundException("User with userID " + userID + " does not exist.")
        );

        if (user.getUserID().equals(requestUserID)){
            userRepository.delete(user);
        }
        else {
            throw new UserNotAuthorizedException("User not authorized to delete this user account");
        }
    }

    public List<UserProfileDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserProfileDTO> userProfileDTOS = new ArrayList<>();

        for (User user : users) {
            UserProfileDTO userProfileDTO = conversionUserProfileService.convertToUserProfileDTO(user);
            userProfileDTOS.add(userProfileDTO);
        }

        return userProfileDTOS;
    }


}

