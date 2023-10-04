package inpeace.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BookmarkedPostID implements Serializable {
    @Column(name= "userid")
    private Long userID;

    @Column(name = "postid")
    private Long postID;

    // Required by Hibernate
    public BookmarkedPostID() {
    }

    public BookmarkedPostID(Long userID, Long postID) {
        this.userID = userID;
        this.postID = postID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Long getPostID() {
        return postID;
    }

    public void setPostID(Long postID) {
        this.postID = postID;
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
            BookmarkedPostID other = (BookmarkedPostID) o;
            return (Objects.equals(other.getUserID(), this.getUserID()) && Objects.equals(other.getPostID(), this.getPostID()));
        }
    }

    @Override
    public int hashCode(){
        return Objects.hash(userID, postID);
    }
}
