package inpeace.userservice.dao;

import inpeace.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserID(Long userID);

    Optional<User> findByUsername(String username);

    void deleteByUserID(Long userID);
}
