package inpeace.communityservice.dao;

import inpeace.communityservice.model.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT * FROM posts p WHERE DATE(p.dateCreated) = ?1 ORDER BY p.dateCreated DESC", nativeQuery = true)
    List<Post> findAllByDateCreatedIgnoringTime(@Param("dateCreated") LocalDate dateCreated);

    @Query(value = "SELECT * FROM posts p ORDER BY p.datecreated DESC LIMIT ?1", nativeQuery = true)
    List<Post> findByOrderByDateCreatedDesc(@Param("limit") Integer limit);

}
