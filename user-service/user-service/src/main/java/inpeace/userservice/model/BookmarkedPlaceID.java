package inpeace.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BookmarkedPlaceID implements Serializable {
    @Column(name= "userid")
    private Long userID;

    @Column(name = "placeid")
    private String placeID;

    // Required by Hibernate
    public BookmarkedPlaceID() {
    }

    public  BookmarkedPlaceID(Long userID, String placeID) {
        this.userID = userID;
        this.placeID = placeID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getPlaceID() {
        return placeID;
    }

    public void setPlaceID(String placeID) {
        this.placeID = placeID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        else if (o == null || getClass() != o.getClass()) {
            return false;
        }
        else {
            BookmarkedPlaceID other = (BookmarkedPlaceID) o;
            return (Objects.equals(other.getUserID(), this.getUserID()) && Objects.equals(other.getPlaceID(), this.getPlaceID()));
        }
    }

    @Override
    public int hashCode(){
        return Objects.hash(userID, placeID);
    }
}
