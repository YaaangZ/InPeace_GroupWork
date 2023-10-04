package inpeace.userservice.dao;

import inpeace.userservice.model.IndoorOutdoor;
import inpeace.userservice.model.MyersBriggsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IndoorOutdoorRepository extends JpaRepository<IndoorOutdoor, Long> {

    Optional<IndoorOutdoor> findByIndoorOutdoor(String indoorOutdoor);

    // Optional<MyersBriggsType> findById(Long id);
}
