package inpeace.communityservice.dao;

import inpeace.communityservice.model.Comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(value = "WITH RECURSIVE commenttree AS (" +
            "SELECT c.commentid, c.authorid, c.content, c.referringcommentid, c.postid, c.datecreated, c.dateupdated FROM comments c " +
            "WHERE postid = :postId " +
            "UNION " +
            "SELECT c.commentid, c.authorid, c.content, c.referringcommentid, c.postid, c.datecreated, c.dateupdated FROM comments c " +
            "INNER JOIN commenttree bc ON bc.commentid = c.referringcommentid" +
            ") SELECT * FROM commentTree", nativeQuery = true)
    List<Comment> findAllCommentsForPost(@Param("postId") Long postId);
}

