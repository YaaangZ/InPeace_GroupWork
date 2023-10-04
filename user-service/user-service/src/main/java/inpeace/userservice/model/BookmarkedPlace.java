package inpeace.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name="bookmarkedplaces")
public class BookmarkedPlace {

    @EmbeddedId
    private BookmarkedPlaceID id;

    public BookmarkedPlaceID getId() {
        return id;
    }

    public void setID(BookmarkedPlaceID id) {
        this.id = id;
    }

    public Long getUserID() {
        return id.getUserID();
    }

    public String getPlaceID() {
        return id.getPlaceID();
    }

}
