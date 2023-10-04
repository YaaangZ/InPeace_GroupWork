package inpeace.userservice.service;

import inpeace.userservice.dao.*;
import inpeace.userservice.dto.BookmarkedPlaceDTO;
import inpeace.userservice.dto.BookmarkedPostDTO;
import inpeace.userservice.exception.PlaceNotFoundException;
import inpeace.userservice.exception.PostNotFoundException;
import inpeace.userservice.exception.UserNotAuthorizedException;
import inpeace.userservice.exception.UserNotFoundException;
import inpeace.userservice.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookmarksService {

    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;
    private final PostRepository postRepository;
    private final BookmarkedPlaceRepository bookmarkedPlaceRepository;
    private final BookmarkedPostRepository bookmarkedPostRepository;
    private final ConversionBookmarkService conversionBookmarkService;

    @Autowired
    public BookmarksService(UserRepository userRepository, PlaceRepository placeRepository, PostRepository postRepository,
                            BookmarkedPostRepository bookmarkedPostRepository, BookmarkedPlaceRepository bookmarkedPlaceRepository,
                            ConversionBookmarkService conversionBookmarkService) {
        this.userRepository = userRepository;
        this.placeRepository = placeRepository;
        this.postRepository = postRepository;
        this.bookmarkedPlaceRepository = bookmarkedPlaceRepository;
        this.bookmarkedPostRepository = bookmarkedPostRepository;
        this.conversionBookmarkService = conversionBookmarkService;
    }
    public void bookmarkPlace(Long userID, String placeID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to create bookmarks for this user");
        }
        userRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userID + " does not exist"));
        // Check if a placeID is a valid ID
        placeRepository.findById(placeID)
                .orElseThrow(() -> new PlaceNotFoundException("Place with id " + placeID + "does not exist"));

        BookmarkedPlaceDTO bookmarkedPlaceDTO = new BookmarkedPlaceDTO();
        bookmarkedPlaceDTO.setPlaceID(placeID);

        BookmarkedPlace bookmarkedPlace = conversionBookmarkService.convertToBookmarkedPlace(bookmarkedPlaceDTO, userID);
        bookmarkedPlaceRepository.save(bookmarkedPlace);
    }


    public void removeBookmarkPlace(Long userID, String placeID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to remove bookmarks for this user");
        }
        // Check if userID is a valid ID
        userRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userID + " does not exist"));
        // Check if a placeID is a valid ID
        placeRepository.findById(placeID)
                .orElseThrow(() -> new PlaceNotFoundException("Place with id " + placeID + "does not exist"));

        BookmarkedPlaceID bookmarkedPlaceID = new BookmarkedPlaceID(userID, placeID);
        if (bookmarkedPlaceRepository.existsById(bookmarkedPlaceID)) {
            bookmarkedPlaceRepository.deleteById(bookmarkedPlaceID);
        }
        else {
            throw new IllegalArgumentException("No bookmark found for user with id " + userID + ", and place with id " +  placeID);
        }
    }

    public List<BookmarkedPlaceDTO> getAllUserBookmarkPlaces(Long userID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to get bookmarks for this user");
        }
        List<BookmarkedPlace> bookmarkedPlaces = bookmarkedPlaceRepository.findAllByIdUserID(userID);
        List<BookmarkedPlaceDTO> bookmarkedPlaceDTOs = new ArrayList<>();

        for (BookmarkedPlace bookmarkedPlace : bookmarkedPlaces) {
            BookmarkedPlaceDTO bookmarkedPlaceDTO = conversionBookmarkService.convertToBookmarkedPlaceDTO(bookmarkedPlace);
            bookmarkedPlaceDTOs.add(bookmarkedPlaceDTO);
        }

        return bookmarkedPlaceDTOs;
    }

    public void bookmarkPost(Long userID, Long postID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to create bookmarks for this user");
        }
        // Check if userID is a valid ID
        userRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userID + " does not exist"));
        // Check if a postID is a valid ID
        postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with id " + postID + " does not exist"));

        BookmarkedPostDTO bookmarkedPostDTO = new BookmarkedPostDTO();
        bookmarkedPostDTO.setPostID(postID);

        BookmarkedPost bookmarkedPost = conversionBookmarkService.convertoBookmarkedPost(bookmarkedPostDTO, userID);
        bookmarkedPostRepository.save(bookmarkedPost);
    }

    public void removeBookmarkPost(Long userID, Long postID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to remove bookmarks for this user");
        }
        // Check if userID is a valid ID
        userRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userID + " does not exist"));
        // Check if a postID is a valid ID
        postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with id " + postID + " does not exist"));

        BookmarkedPostID bookmarkedPostID = new BookmarkedPostID(userID, postID);
        if (bookmarkedPostRepository.existsById(bookmarkedPostID)) {
            bookmarkedPostRepository.deleteById(bookmarkedPostID);
        } else {
            throw new IllegalArgumentException("No bookmark found for user with id " + userID + ", and post with id " + postID);
        }
    }

    public List<BookmarkedPostDTO> getAllUserBookmarkPosts(Long userID, Long requestUserID) {
        if (!requestUserID.equals(userID)){
            throw new UserNotAuthorizedException("Not authorized to get bookmarks for this user");
        }
        List<BookmarkedPost> bookmarkedPosts = bookmarkedPostRepository.findAllByIdUserID(userID);
        List<BookmarkedPostDTO> bookmarkedPostDTOs = new ArrayList<>();

        for (BookmarkedPost bookmarkedPost : bookmarkedPosts) {
            BookmarkedPostDTO bookmarkedPostDTO = conversionBookmarkService.convertToBookmarkedPostDTO(bookmarkedPost);
            bookmarkedPostDTOs.add(bookmarkedPostDTO);
        }

        return bookmarkedPostDTOs;
    }
}
