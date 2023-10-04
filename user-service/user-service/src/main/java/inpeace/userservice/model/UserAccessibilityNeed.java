package inpeace.userservice.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="useraccessibilityneeds")
public class UserAccessibilityNeed {

    @EmbeddedId
    private UserAccessibilityNeedID id;

    public UserAccessibilityNeedID getId() {
        return id;
    }

    public void setId(UserAccessibilityNeedID id) {
        this.id = id;
    }

    public Long getUserID(){
        return id.getUserID();
    }

    public Long getAccessibilityNeedID(){
        return id.getAccessibilityNeedID();
    }
}
