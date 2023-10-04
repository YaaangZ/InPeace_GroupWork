package inpeace.userservice.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="bookmarkedposts")
public class BookmarkedPost {

    @EmbeddedId
    private BookmarkedPostID id;

    public BookmarkedPostID getId() {
        return id;
    }

    public void setID(BookmarkedPostID id) {
        this.id = id;
    }

    public Long getUserID() {
        return id.getUserID();
    }

    public Long getPostID() {
        return id.getPostID();
    }

}
