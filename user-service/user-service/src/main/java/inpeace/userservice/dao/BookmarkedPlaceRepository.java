package inpeace.userservice.dao;

import inpeace.userservice.model.BookmarkedPlace;
import inpeace.userservice.model.BookmarkedPlaceID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookmarkedPlaceRepository extends JpaRepository<BookmarkedPlace, BookmarkedPlaceID> {

    List<BookmarkedPlace> findAllByIdUserID(Long userID);
    List<BookmarkedPlace> findAllByIdPlaceID(String placeID);

}
