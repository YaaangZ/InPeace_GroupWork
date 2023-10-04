package inpeace.communityservice.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="comments")
public class Comment {
    @Id
    @Column(name="commentid")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long commentID;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="authorid")
    private User author;

    @Column(nullable = false, name="content")
    private String content;

    @Column(nullable = false, name="datecreated")
    private LocalDateTime dateCreated;

    @Column(nullable = false, name="dateupdated")
    private LocalDateTime dateUpdated;

    @Column(nullable = true, name="postid")
    private Long parentPostID;

    @Column(nullable = true, name="referringcommentid")
    private Long parentCommentID;

    public Long getCommentID() {
        return commentID;
    }

    public void setCommentID(Long commentID) {
        this.commentID = commentID;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public LocalDateTime getDateUpdated() {
        return dateUpdated;
    }

    public void setDateUpdated(LocalDateTime dateUpdated) {
        this.dateUpdated = dateUpdated;
    }

    public Long getParentPostID() {
        return parentPostID;
    }

    public void setParentPostID(Long parentPostID) {
        this.parentPostID = parentPostID;
    }

    public Long getParentCommentID() {
        return parentCommentID;
    }

    public void setParentCommentID(Long parentCommentID) {
        this.parentCommentID = parentCommentID;
    }

}
