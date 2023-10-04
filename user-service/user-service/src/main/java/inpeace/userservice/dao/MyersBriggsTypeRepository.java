package inpeace.userservice.dao;

import inpeace.userservice.model.MyersBriggsType;
import inpeace.userservice.model.PlaceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MyersBriggsTypeRepository extends JpaRepository<MyersBriggsType, Long> {

    Optional<MyersBriggsType> findByPersonalityType(String personalityType);

    // Optional<MyersBriggsType> findById(Long id);
}
