package inpeace.userservice.dao;

import inpeace.userservice.model.AmenityNeed;
import inpeace.userservice.model.UserAmenityNeedID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityNeedRepository extends JpaRepository<AmenityNeed, Long> {
    Optional<AmenityNeed> findByAmenityString(String amenityString);
}
