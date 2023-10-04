package inpeace.userservice.dao;

import inpeace.userservice.model.AccessibilityNeed;
import inpeace.userservice.model.UserAccessibilityNeedID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessibilityNeedRepository extends JpaRepository<AccessibilityNeed, Long> {

    Optional<AccessibilityNeed> findByAccessibilityString(String accessibilityString);
}


