//package inpeace.userservice.test;
//
//import inpeace.userservice.dao.*;
//import inpeace.userservice.dto.UserProfileDTO;
//import inpeace.userservice.service.UserService;
//import inpeace.userservice.model.User;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.ArgumentCaptor;
//import org.mockito.Mock;
//import org.springframework.context.MessageSource;
//
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//import static org.mockito.MockitoAnnotations.openMocks;
//
//public class UserServiceTest {
//
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private PlaceRepository placeRepository;
//
//    @Mock
//    private PostRepository postRepository;
//
//    @Mock
//    private BookmarkedPostRepository bookmarkedPostRepository;
//
//    @Mock
//    private BookmarkedPlaceRepository bookmarkedPlaceRepository;
//
//    @Mock
//    private MessageSource messageSource;
//
//    private UserService userService;
//
//    @BeforeEach
//    void setUp() {
//        openMocks(this);
//        userService = new UserService(userRepository, placeRepository, postRepository, bookmarkedPostRepository, bookmarkedPlaceRepository, messageSource, dtoConversionService);
//    }
//
//    @Test
//    void testUpdateUser() {
//        // Prepare test data
//        Long userID = 1L;
//        UserProfileDTO userProfileDTO = new UserProfileDTO();
//        userProfileDTO.setUsername("newUsername");
//
//        // Create a new user with ID of 1, with username oldUsername
//        User existingUser = new User();
//        existingUser.setUserID(userID);
//        existingUser.setUsername("oldUsername");
//
//        // Create an updatedUser object with a username newUsername
//        User updatedUser = new User();
//        updatedUser.setUsername("newUsername");
//
//        // Mock the behavior of userRepository.findByUserID(userID) and dtoConversionService.convertToUser(userProfileDTO)
//        when(userRepository.findByUserID(userID)).thenReturn(Optional.of(existingUser));
//
//        // Call the method to be tested
//        userService.updateUser(userID, userProfileDTO);
//
//        // Verify the interactions
//        // Verify that userRepository.findByUserID(userID) was called exactly once
//        verify(userRepository, times(1)).findByUserID(userID);
//        // Verify that dtoConversionService.convertToUser(userProfileDTO) was called exactly once
//        verify(dtoConversionService, times(1)).convertToUser(userProfileDTO);
//
//        // Test the logic
//        // Assert that the username of existingUser was updated to the username of updatedUser
//        assertEquals(updatedUser.getUsername(), existingUser.getUsername());
//
//        // Verify that userRepository.save(existingUser) was called exactly once
//        verify(userRepository, times(1)).save(existingUser);
//
//        // Assert that the user passed to save is the updated user
//        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
//        verify(userRepository).save(userCaptor.capture());
//        User userPassedToSave = userCaptor.getValue();
//
//        // Compare the user passed to save() with the existingUser after it was updated
//        assertEquals(userPassedToSave.getUsername(), existingUser.getUsername());
//    }
//
//
//
//}
