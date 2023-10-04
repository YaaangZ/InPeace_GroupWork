package inpeace.userservice.service;

import inpeace.userservice.dao.*;
import inpeace.userservice.dto.BookmarkedPlaceDTO;
import inpeace.userservice.dto.BookmarkedPostDTO;
import inpeace.userservice.model.BookmarkedPlace;
import inpeace.userservice.model.BookmarkedPlaceID;
import inpeace.userservice.model.BookmarkedPost;
import inpeace.userservice.model.BookmarkedPostID;
import org.springframework.stereotype.Service;

@Service
public class ConversionBookmarkService {

    public BookmarkedPlace convertToBookmarkedPlace(BookmarkedPlaceDTO bookmarkedPlaceDTO, Long userID){

        BookmarkedPlaceID id = new BookmarkedPlaceID(userID, bookmarkedPlaceDTO.getPlaceID());
        BookmarkedPlace bookmarkedPlace = new BookmarkedPlace();
        bookmarkedPlace.setID(id);

        return bookmarkedPlace;
    }

    public BookmarkedPlaceDTO convertToBookmarkedPlaceDTO(BookmarkedPlace bookmarkedPlace) {
        String placeID = bookmarkedPlace.getPlaceID();

        BookmarkedPlaceDTO bookmarkedPlaceDTO = new BookmarkedPlaceDTO();
        bookmarkedPlaceDTO.setPlaceID(placeID);

        return bookmarkedPlaceDTO;
    }

    public BookmarkedPost convertoBookmarkedPost(BookmarkedPostDTO bookmarkedPostDTO, Long userID){
        BookmarkedPostID id = new BookmarkedPostID(userID, bookmarkedPostDTO.getPostID());
        BookmarkedPost bookmarkedPost = new BookmarkedPost();
        bookmarkedPost.setID(id);

        return bookmarkedPost;
    }

    public BookmarkedPostDTO convertToBookmarkedPostDTO(BookmarkedPost bookmarkedPost) {
        Long postID = bookmarkedPost.getPostID();

        BookmarkedPostDTO bookmarkedPostDTO = new BookmarkedPostDTO();
        bookmarkedPostDTO.setPostID(postID);

        return bookmarkedPostDTO;
    }
}
