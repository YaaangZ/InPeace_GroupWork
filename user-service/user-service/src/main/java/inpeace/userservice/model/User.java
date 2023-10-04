package inpeace.userservice.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import inpeace.userservice.model.AmenityNeed;
import inpeace.userservice.model.AccessibilityNeed;


@Entity
@Table(name="users")
public class User {

    @Id
    @Column(name="userid")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long userID;

    @Column (nullable = false, unique = true, name="emailaddress")
    private String emailAddress;

    @Column(nullable = false, name="username")
    private String username;

    @Column(nullable = false, name="dateupdated")
    private LocalDateTime dateUpdated;

    @Column(nullable = true)
    private String bio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "preferredcategory", nullable = true)
    private PlaceCategory preferredCategory;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "preferredbusyness", nullable = true)
    private Busyness preferredBusyness;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "preferredindooroutdoor", nullable = true)
    private IndoorOutdoor preferredIndoorOutdoor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "myersbriggspersonality", nullable = true)
    private MyersBriggsType myersBriggsType;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "useraccessibilityneeds",
            joinColumns = @JoinColumn(name = "userid"),
            inverseJoinColumns = @JoinColumn(name = "accessibilityneedid")
    )
    private List<AccessibilityNeed> accessibilityNeeds = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "useramenityneeds",
            joinColumns = @JoinColumn(name = "userid"),
            inverseJoinColumns = @JoinColumn(name = "amenityneedid")
    )
    private List<AmenityNeed> amenityNeeds = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="avatarid")
    private Avatar avatar;

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

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

    public LocalDateTime getDateUpdated() {
        return dateUpdated;
    }

    public void setDateUpdated(LocalDateTime dateUpdated) {
        this.dateUpdated = dateUpdated;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public PlaceCategory getPreferredCategory() {
        return preferredCategory;
    }

    public void setPreferredCategory(PlaceCategory preferredCategory) {
        this.preferredCategory = preferredCategory;
    }

    public Busyness getPreferredBusyness() {
        return preferredBusyness;
    }

    public void setPreferredBusyness(Busyness preferredBusyness) {
        this.preferredBusyness = preferredBusyness;
    }

    public IndoorOutdoor getPreferredIndoorOutdoor() {
        return preferredIndoorOutdoor;
    }

    public void setPreferredIndoorOutdoor(IndoorOutdoor preferredIndoorOutdoor) {
        this.preferredIndoorOutdoor = preferredIndoorOutdoor;
    }

    public MyersBriggsType getMyersBriggsType() {
        return myersBriggsType;
    }

    public void setMyersBriggsType(MyersBriggsType myersBriggsType) {
        this.myersBriggsType = myersBriggsType;
    }

    public List<AccessibilityNeed> getAccessibilityNeeds() {
        return accessibilityNeeds;
    }

    public void setAccessibilityNeeds(List<AccessibilityNeed> accessibilityNeeds) {
        this.accessibilityNeeds = accessibilityNeeds;
    }

    public void addAccessibilityNeed(AccessibilityNeed accessibilityNeed){
        if(accessibilityNeeds == null) {
            accessibilityNeeds = new ArrayList<>();
        }
        accessibilityNeeds.add(accessibilityNeed);
        accessibilityNeed.getUsers().add(this);
    }

    public void removeAccessibilityNeed(AccessibilityNeed accessibilityNeed){
        accessibilityNeeds.remove(accessibilityNeed);
        accessibilityNeed.getUsers().remove(this);
    }

    public List<AmenityNeed> getAmenityNeeds() {
        return amenityNeeds;
    }

    public void setAmenityNeeds(List<AmenityNeed> amenityNeeds) {
        this.amenityNeeds = amenityNeeds;
    }

    public void addAmenityNeed(AmenityNeed amenityNeed){
        if(amenityNeeds == null) {
            amenityNeeds = new ArrayList<>();
        }
        amenityNeeds.add(amenityNeed);
        amenityNeed.getUsers().add(this);
    }

    public void removeAmenityNeed(AmenityNeed amenityNeed){
        accessibilityNeeds.remove(amenityNeed);
        amenityNeed.getUsers().remove(this);
    }

    public Avatar getAvatar() {
        return avatar;
    }

    public void setAvatar(Avatar avatar) {
        this.avatar = avatar;
    }

    @Override
    public String toString() {
        return "UserDAO{" +
                "emailAddress='" + emailAddress + '\'' +
                '}';
    }
}


