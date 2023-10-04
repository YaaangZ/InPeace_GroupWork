package inpeace.communityservice.dao;

import inpeace.communityservice.model.Comment;
import inpeace.communityservice.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRepository extends JpaRepository<Place, String> {


}
