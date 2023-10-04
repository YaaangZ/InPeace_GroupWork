package inpeace.userservice.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="amenityneeds")
public class AmenityNeed {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name="amenityneedid")
    private Long amenityID;

    @Column(name="amenity")
    private String amenityString;

    @ManyToMany(mappedBy = "amenityNeeds")
    private List<User> users = new ArrayList<>();

    public Long getAmenityID() {
        return amenityID;
    }

    public void setAmenityID(Long tagID) {
        this.amenityID = tagID;
    }

    public String getAmenityString() {
        return amenityString;
    }

    public void setAmenityString(String amenityString) {
        this.amenityString = amenityString;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void addUser(User user) {
        users.add(user);
        user.getAmenityNeeds().add(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.getAmenityNeeds().remove(this);
    }

    @Override
    public boolean equals(Object o){
        if (this == o) {
            return true;
        }
        else if (o == null || getClass() != o.getClass()) {
            return false;
        }
        else {
            AmenityNeed other = (AmenityNeed) o;
            return (Objects.equals(other.getAmenityString(), this.getAmenityString()));
        }
    }

}
