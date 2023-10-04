package inpeace.userservice.service;

import inpeace.userservice.dao.*;
import inpeace.userservice.dto.AvatarDTO;
import inpeace.userservice.dto.MyersBriggsTypeDTO;
import inpeace.userservice.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PreferencesService {

    private final PlaceCategoryRepository placeCategoryRepository;
    private final BusynessRepository busynessRepository;
    private final AmenityNeedRepository amenityNeedRepository;
    private final AccessibilityNeedRepository accessibilityNeedRepository;
    private final MyersBriggsTypeRepository myersBriggsTypeRepository;
    private final AvatarRepository avatarRepository;
    private final IndoorOutdoorRepository indoorOutdoorRepository;
    private final ConversionPreferenceService conversionPreferenceService;


    public PreferencesService(PlaceCategoryRepository placeCategoryRepository, BusynessRepository busynessRepository,
                              AmenityNeedRepository amenityNeedRepository, AccessibilityNeedRepository accessibilityNeedRepository,
                              MyersBriggsTypeRepository myersBriggsTypeRepository, AvatarRepository avatarRepository,
                              IndoorOutdoorRepository indoorOutdoorRepository, ConversionPreferenceService conversionPreferenceService){
        this.placeCategoryRepository = placeCategoryRepository;
        this.busynessRepository = busynessRepository;
        this.amenityNeedRepository = amenityNeedRepository;
        this.accessibilityNeedRepository = accessibilityNeedRepository;
        this.myersBriggsTypeRepository = myersBriggsTypeRepository;
        this.avatarRepository = avatarRepository;
        this.indoorOutdoorRepository = indoorOutdoorRepository;
        this.conversionPreferenceService = conversionPreferenceService;
    }


    public List<String> getAllCategories() {
        List<PlaceCategory> placeCategories = placeCategoryRepository.findAll();
        List<String> placeCategoryStrings = new ArrayList<>();

        for (PlaceCategory placeCategory : placeCategories) {
            String placeCategoryString = conversionPreferenceService.convertToPlaceCategoryString(placeCategory);
            placeCategoryStrings.add(placeCategoryString);
        }
        return placeCategoryStrings;
    }

    public List<String> getAllBusynessLevels() {
        List<Busyness> busynessLevels = busynessRepository.findAll();
        List<String> busynessStrings = new ArrayList<>();

        for (Busyness busyness : busynessLevels) {
            String busynessString = conversionPreferenceService.convertToBusynessString(busyness);
            busynessStrings.add(busynessString);
        }
        return busynessStrings;
    }

    public List<String> getAllAmenityNeeds() {
        List<AmenityNeed> amenityNeeds = amenityNeedRepository.findAll();
        List<String> amenityNeedStrings = new ArrayList<>();

        for (AmenityNeed amenityNeed : amenityNeeds) {
            String amenityNeedString = conversionPreferenceService.convertToAmenityString(amenityNeed);
            amenityNeedStrings.add(amenityNeedString);
        }
        return amenityNeedStrings;
    }

    public List<String> getAllAccessibilityNeeds() {
        List<AccessibilityNeed> accessibilityNeeds = accessibilityNeedRepository.findAll();
        List<String> accessibilityNeedStrings = new ArrayList<>();

        for (AccessibilityNeed accessibilityNeed : accessibilityNeeds) {
            String accessibilityNeedString = conversionPreferenceService.convertToAccessibilityString(accessibilityNeed);
            accessibilityNeedStrings.add(accessibilityNeedString);
        }
        return accessibilityNeedStrings;
    }

    public List<AvatarDTO> getAllAvatars() {
        List<Avatar> avatars = avatarRepository.findAll();
        List<AvatarDTO> avatarDTOs = new ArrayList<>();

        for (Avatar avatar : avatars) {
            AvatarDTO avatarDTO = conversionPreferenceService.convertToAvatarDTO(avatar);
            avatarDTOs.add(avatarDTO);
        }
        return avatarDTOs;
    }

    public List<MyersBriggsTypeDTO> getAllMyersBriggsPersonalities() {
        List<MyersBriggsType> myersBriggsTypes = myersBriggsTypeRepository.findAll();
        List<MyersBriggsTypeDTO> myersBriggsTypeDTOs = new ArrayList<>();

        for (MyersBriggsType myersBriggsType : myersBriggsTypes) {
            MyersBriggsTypeDTO myersBriggsTypeDTO = conversionPreferenceService.convertToMyersBriggsTypeDTO(myersBriggsType);
            myersBriggsTypeDTOs.add(myersBriggsTypeDTO);
        }
        return myersBriggsTypeDTOs;
    }

    public List<String> getAllIndoorOutdoorPreferences() {
        List<IndoorOutdoor> indoorOutdoorPreferences = indoorOutdoorRepository.findAll();
        List<String> indoorOutdoorStrings = new ArrayList<>();

        for (IndoorOutdoor indoorOutdoor : indoorOutdoorPreferences) {
            String indoorOutdoorString = conversionPreferenceService.convertToIndoorOutdoorString(indoorOutdoor);
            indoorOutdoorStrings.add(indoorOutdoorString);
        }
        return indoorOutdoorStrings;
    }

}
