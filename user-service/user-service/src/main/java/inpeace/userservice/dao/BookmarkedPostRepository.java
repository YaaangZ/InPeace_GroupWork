package inpeace.userservice.dao;

import inpeace.userservice.model.BookmarkedPost;
import inpeace.userservice.model.BookmarkedPostID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookmarkedPostRepository extends JpaRepository<BookmarkedPost, BookmarkedPostID> {
    List<BookmarkedPost> findAllByIdUserID(Long userID);
    List<BookmarkedPost> findAllByIdPostID(Long postID);

}
