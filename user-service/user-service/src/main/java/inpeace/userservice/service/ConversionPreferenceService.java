package inpeace.userservice.service;

import inpeace.userservice.dao.*;
import inpeace.userservice.dto.AvatarDTO;
import inpeace.userservice.dto.MyersBriggsTypeDTO;
import inpeace.userservice.exception.PreferenceNotFoundException;
import inpeace.userservice.exception.AvatarNotFoundException;
import inpeace.userservice.model.*;
import org.springframework.stereotype.Service;

@Service
public class ConversionPreferenceService {

    private final PlaceCategoryRepository placeCategoryRepository;
    private final BusynessRepository busynessRepository;
    private final MyersBriggsTypeRepository myersBriggsTypeRepository;
    private final IndoorOutdoorRepository indoorOutdoorRepository;
    private final AmenityNeedRepository amenityNeedRepository;
    private final AccessibilityNeedRepository accessibilityNeedRepository;
    private final AvatarRepository avatarRepository;

    public ConversionPreferenceService(PlaceCategoryRepository placeCategoryRepository, BusynessRepository busynessRepository,
                                       MyersBriggsTypeRepository myersBriggsTypeRepository, IndoorOutdoorRepository indoorOutdoorRepository, AmenityNeedRepository amenityNeedRepository,
                                       AccessibilityNeedRepository accessibilityNeedRepository, AvatarRepository avatarRepository){
        this.placeCategoryRepository = placeCategoryRepository;
        this.busynessRepository = busynessRepository;
        this.myersBriggsTypeRepository = myersBriggsTypeRepository;
        this.indoorOutdoorRepository = indoorOutdoorRepository;
        this.amenityNeedRepository = amenityNeedRepository;
        this.accessibilityNeedRepository = accessibilityNeedRepository;
        this.avatarRepository = avatarRepository;
    }


    // PlaceCategory methods
    public String convertToPlaceCategoryString(PlaceCategory placeCategory) {
        return placeCategory.getCategory();
    }

    public PlaceCategory convertToPlaceCategory(String category) {
        return placeCategoryRepository.findByCategory(category.toLowerCase()).orElseThrow(
                () -> new PreferenceNotFoundException("Category not found: " + category)
        );
    }

    // Busyness methods
    public String convertToBusynessString(Busyness busyness) {
        return busyness.getBusyness();
    }

    public Busyness convertToBusyness(String busyness) {
        return busynessRepository.findByBusyness(toTitleCase(busyness)).orElseThrow(
                () -> new PreferenceNotFoundException("Busyness not found: " + busyness)
        );
    }

    // Amenity methods
    public String convertToAmenityString(AmenityNeed amenity) {
        return amenity.getAmenityString();
    }

    public AmenityNeed convertToAmenity(String amenityNeed) {
        return amenityNeedRepository.findByAmenityString(amenityNeed)
                .orElseThrow(() -> new PreferenceNotFoundException("Invalid amenity need: " + amenityNeed));
    }

    // Accessibility methods
    public String convertToAccessibilityString(AccessibilityNeed accessibilityNeed) {
        return accessibilityNeed.getAccessibilityString();
    }

    public AccessibilityNeed convertToAccessibility(String accessibilityNeed) {
        return accessibilityNeedRepository.findByAccessibilityString(accessibilityNeed)
                .orElseThrow(() -> new PreferenceNotFoundException("Invalid accessibility need: " + accessibilityNeed));
    }

    // MyersBriggsType methods
    public MyersBriggsTypeDTO convertToMyersBriggsTypeDTO(MyersBriggsType myersBriggsType) {
        MyersBriggsTypeDTO myersBriggsTypeDTO = new MyersBriggsTypeDTO();
        myersBriggsTypeDTO.setAcronym(myersBriggsType.getPersonalityType());
        myersBriggsTypeDTO.setFullName(myersBriggsType.getPersonalityType() + " - " + myersBriggsType.getRole());
        return myersBriggsTypeDTO;
    }

    public MyersBriggsType convertToMyersBriggsType(String myersBriggsType) {
        return myersBriggsTypeRepository.findByPersonalityType(myersBriggsType.toUpperCase())
                .orElseThrow(() -> new PreferenceNotFoundException("MyersBriggsType not found: " + myersBriggsType));
    }

    public String convertToMyersBriggsTypeString(MyersBriggsType myersBriggsType){
        return myersBriggsType.getPersonalityType();
    }

    // IndoorOutdoor methods
    public String convertToIndoorOutdoorString(IndoorOutdoor indoorOutdoor) {
        return indoorOutdoor.getIndoorOutdoor();
    }

    public IndoorOutdoor convertToIndoorOutdoor(String indoorOutdoor) {
        return indoorOutdoorRepository.findByIndoorOutdoor(indoorOutdoor.toLowerCase()).orElseThrow(
                () -> new PreferenceNotFoundException("IndoorOutdoor not found: " + indoorOutdoor)
        );
    }

    // Avatar methods
    public AvatarDTO convertToAvatarDTO(Avatar avatar) {
        AvatarDTO avatarDTO = new AvatarDTO();
        avatarDTO.setAvatarID(avatar.getAvatarID());
        avatarDTO.setAvatar(avatar.getSvg());
        return avatarDTO;
    }

    public Avatar convertToAvatar(Long id) {
        return avatarRepository.findByAvatarID(id).orElseThrow(
                () -> new AvatarNotFoundException("Avatar not found: " + id)
        );
    }

    private String toTitleCase(String str) {
        String[] words = str.split(" ");
        StringBuilder titleCase = new StringBuilder();

        for(String word : words) {
            if(word.length() == 0) continue;
            titleCase.append(Character.toUpperCase(word.charAt(0)));
            if(word.length() > 1) titleCase.append(word.substring(1).toLowerCase());
            titleCase.append(" ");
        }

        return titleCase.toString().trim();
    }
}
