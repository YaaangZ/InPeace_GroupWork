package inpeace.communityservice.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CommentDTO {

    private Long commentID;
    private Long userID;
    private String username;
    private String avatar;
    private Long parentPostID;
    private Long parentCommentID;
    private String commentContent;
    private List<CommentDTO> childrenComments = new ArrayList<>();

    public Long getCommentID() {
        return commentID;
    }

    public void setCommentID(Long commentID) {
        this.commentID = commentID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
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

    public String getCommentContent() {
        return commentContent;
    }

    public void setCommentContent(String commentContent) {
        this.commentContent = commentContent;
    }

    public void addChild(CommentDTO child){
        childrenComments.add(child);
    }

    public List<CommentDTO> getChildrenComments() {
        return childrenComments;
    }

}
