package inpeace.userservice.dao;

import inpeace.userservice.model.PlaceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlaceCategoryRepository extends JpaRepository<PlaceCategory, Long> {
    Optional<PlaceCategory> findByCategory(String category);
}
