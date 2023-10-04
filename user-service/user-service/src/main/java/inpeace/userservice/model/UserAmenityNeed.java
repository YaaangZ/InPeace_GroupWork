package inpeace.userservice.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="useramenityneeds")
public class UserAmenityNeed {

    @EmbeddedId
    private UserAmenityNeedID id;

    public UserAmenityNeedID getId() {
        return id;
    }

    public void setId(UserAmenityNeedID id) {
        this.id = id;
    }

    public Long getUserID(){
        return id.getUserID();
    }

    public Long getAmenityNeedID(){
        return id.getAmenityNeedID();
    }
}
