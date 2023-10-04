package inpeace.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserAccessibilityNeedID implements Serializable {

    @Column(name="userid")
    private Long userID;

    @Column(name="accessibilityneedid")
    private Long accessibilityNeedID;

    public UserAccessibilityNeedID(){}

    public UserAccessibilityNeedID(Long userID, Long accessibilityNeedID){
        this.userID =userID;
        this.accessibilityNeedID = accessibilityNeedID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Long getAccessibilityNeedID() {
        return accessibilityNeedID;
    }

    public void setAccessibilityNeedID(Long accessibilityNeedID) {
        this.accessibilityNeedID = accessibilityNeedID;
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
            UserAccessibilityNeedID other = (UserAccessibilityNeedID) o;
            return (Objects.equals(other.getAccessibilityNeedID(), this.getAccessibilityNeedID()) && Objects.equals(other.getUserID(), this.getUserID()));
        }
    }

    @Override
    public int hashCode(){
        return Objects.hash(userID, accessibilityNeedID);
    }
}
