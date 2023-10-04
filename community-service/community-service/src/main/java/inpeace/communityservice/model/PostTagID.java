package inpeace.communityservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PostTagID implements Serializable {

    @Column(name="postid")
    private Long postID;

    @Column(name="tagid")
    private Long tagID;

    // Required by Hibernate
    public PostTagID() {
    }

    public PostTagID(Long postID, Long tagID){
        this.postID = postID;
        this.tagID = tagID;
    }

    public Long getPostID() {
        return postID;
    }

    public void setPostID(Long postID) {
        this.postID = postID;
    }

    public Long getTagID() {
        return tagID;
    }

    public void setTagID(Long tagID) {
        this.tagID = tagID;
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
            PostTagID other = (PostTagID) o;
            return (Objects.equals(other.getPostID(), this.getPostID()) && Objects.equals(other.getTagID(), this.getTagID()));
        }
    }

    @Override
    public int hashCode(){
        return Objects.hash(postID, tagID);
    }
}
