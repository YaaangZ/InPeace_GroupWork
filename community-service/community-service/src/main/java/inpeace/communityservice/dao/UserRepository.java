package inpeace.communityservice.dao;

import inpeace.communityservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserID(Long userID);

    Optional<User> findByEmailAddress(String emailAddress);
}
