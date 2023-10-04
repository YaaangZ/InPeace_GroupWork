package inpeace.userservice.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class UserProfileDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = -8445943548965154778L;

    private String emailAddress;
    private String username;
    private String bio;
    private String avatar;
    private String preferredCategory;
    private String preferredBusyness;
    private String preferredIndoorOutdoor;
    private String myersBriggsType;
    private List<String> amenityNeeds = new ArrayList<>();
    private List<String> accessibilityNeeds = new ArrayList<>();


    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPreferredCategory() {
        return preferredCategory;
    }

    public void setPreferredCategory(String preferredCategory) {
        this.preferredCategory = preferredCategory;
    }


    public String getPreferredBusyness() {
        return preferredBusyness;
    }

    public void setPreferredBusyness(String preferredBusyness) {
        this.preferredBusyness = preferredBusyness;
    }

    public String getPreferredIndoorOutdoor() {
        return preferredIndoorOutdoor;
    }

    public void setPreferredIndoorOutdoor(String preferredIndoorOutdoor) {
        this.preferredIndoorOutdoor = preferredIndoorOutdoor;
    }

    public String getMyersBriggsType() {
        return myersBriggsType;
    }

    public void setMyersBriggsType(String myersBriggsType) {
        this.myersBriggsType = myersBriggsType;
    }

    public List<String> getAmenityNeeds() {
        return amenityNeeds;
    }

    public void setAmenityNeeds(List<String> amenityNeeds) {
        this.amenityNeeds = amenityNeeds;
    }

    public List<String> getAccessibilityNeeds() {
        return accessibilityNeeds;
    }

    public void setAccessibilityNeeds(List<String> accessibilityNeeds) {
        this.accessibilityNeeds = accessibilityNeeds;
    }
}
