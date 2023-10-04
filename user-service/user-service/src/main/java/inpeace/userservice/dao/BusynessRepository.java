package inpeace.userservice.dao;

import inpeace.userservice.model.Busyness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusynessRepository extends JpaRepository<Busyness, Integer> {

    Optional<Busyness> findById(Integer id);

    Optional<Busyness> findByBusyness(String busyness);
}
