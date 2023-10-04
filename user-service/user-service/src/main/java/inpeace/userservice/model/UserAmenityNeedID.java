package inpeace.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserAmenityNeedID implements Serializable {

    @Column(name="userid")
    private Long userID;

    @Column(name="amenityneedid")
    private Long amenityNeedID;

    public UserAmenityNeedID(){}

    public UserAmenityNeedID(Long userID, Long amenityNeedID){
        this.userID =userID;
        this.amenityNeedID = amenityNeedID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Long getAmenityNeedID() {
        return amenityNeedID;
    }

    public void setAmenityNeedID(Long amenityNeedID) {
        this.amenityNeedID = amenityNeedID;
    }

    @Override
    public boolean equals(Object o){
        if (this == o){
            return true;
        }
        else if (o == null || getClass() != o.getClass()){
            return false;
        }
        else {
            UserAmenityNeedID other = (UserAmenityNeedID) o;
            return (Objects.equals(other.getAmenityNeedID(), this.getAmenityNeedID()) && Objects.equals(other.getUserID(), this.getUserID()));
        }
    }

    @Override
    public int hashCode(){
        return Objects.hash(userID, amenityNeedID);
    }
}
