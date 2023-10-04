package inpeace.userservice.dao;

import inpeace.userservice.model.UserAccessibilityNeed;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccessibilityNeedRepository extends JpaRepository<UserAccessibilityNeed, Long> {
}
