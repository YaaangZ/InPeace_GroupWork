package inpeace.communityservice.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="posttags")
public class PostTag {

    @EmbeddedId
    private PostTagID id;

    public PostTagID getId() {
        return id;
    }

    public void setId(PostTagID id) {
        this.id = id;
    }

    public Long getPostID(){
        return id.getPostID();
    }

    public Long getTagID(){
        return id.getTagID();
    }
}
