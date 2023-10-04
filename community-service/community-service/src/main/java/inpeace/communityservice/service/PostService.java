package inpeace.communityservice.service;

import inpeace.communityservice.dao.PlaceRepository;
import inpeace.communityservice.dao.PostRepository;
import inpeace.communityservice.dto.PostDTO;
import inpeace.communityservice.exception.CommentNotFoundException;
import inpeace.communityservice.exception.PlaceNotFoundException;
import inpeace.communityservice.exception.PostNotFoundException;
import inpeace.communityservice.exception.UserNotAuthorizedException;
import inpeace.communityservice.model.Comment;
import inpeace.communityservice.model.Place;
import inpeace.communityservice.model.Post;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private final DTOConversionService dtoConversionService;
    private final PostRepository postRepository;
    private final PlaceRepository placeRepository;


    public PostService(DTOConversionService dtoConversionService, PostRepository postRepository, PlaceRepository placeRepository){
        this.dtoConversionService = dtoConversionService;
        this.postRepository = postRepository;
        this.placeRepository = placeRepository;
    }

    public void createPost(PostDTO postDTO, Long requestUserID) {
        if (!postDTO.getUserID().equals(requestUserID)){
            throw new UserNotAuthorizedException("User not authorized to create post.");
        }
        else {
            Post post = dtoConversionService.convertToPost(postDTO);
            postRepository.save(post);
        }
    }

    public List<PostDTO> getPostsForDate(LocalDate date) {
        List<Post> posts = postRepository.findAllByDateCreatedIgnoringTime(date);
        List<PostDTO> postDTOs = new ArrayList<>();

        for (Post post : posts) {
            PostDTO postDTO = dtoConversionService.convertToPostDTO(post);
            postDTOs.add(postDTO);
        }
        return postDTOs;
    }

    public List<PostDTO> getRecentPosts(Integer limit) {
        if (limit > 100) {
            limit = 100;
        }
        List<Post> posts = postRepository.findByOrderByDateCreatedDesc(limit);
        List<PostDTO> postDTOs = new ArrayList<>();

        for (Post post : posts) {
            PostDTO postDTO = dtoConversionService.convertToPostDTO(post);
            postDTOs.add(postDTO);
        }
        return postDTOs;
    }

    public List<PostDTO> getPostsForPlace(String placeID) {
        Place place = placeRepository.findById(placeID)
                .orElseThrow(() -> new PlaceNotFoundException("Place with ID: " + placeID + " does not exist."));

        List<Post> posts = place.getPosts();
        List<PostDTO> postDTOs = new ArrayList<>();

        for (Post post : posts) {
            PostDTO postDTO = dtoConversionService.convertToPostDTO(post);
            postDTOs.add(postDTO);
        }
        return postDTOs;
    }

    public void updatePost(Long postID, PostDTO postDTO, Long requestUserID) {
        Post existingPost = postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with ID: " + postID + " does not exist."));

        Post updatedPost = dtoConversionService.convertToPost(postDTO);

        if (!existingPost.getAuthor().getUserID().equals(requestUserID)){
            throw new UserNotAuthorizedException("User not authorized to update post.");
        }
        else {
            if (updatedPost.getTitle() != null){
                existingPost.setTitle(updatedPost.getTitle());
            }
            if (updatedPost.getContent() != null){
                existingPost.setContent(updatedPost.getContent());
            }
            if (updatedPost.getTags() != null) {
                existingPost.getTags().clear();
                existingPost.getTags().addAll(updatedPost.getTags());
            }

            existingPost.setDateUpdated(LocalDateTime.now());

            postRepository.delete(updatedPost);
            postRepository.save(existingPost);
        }
    }

    public void deletePost(Long postID, Long requestUserID) {
        Post post = postRepository.findById(postID).orElseThrow(
                () -> new PostNotFoundException("Post with postID " + postID + " does not exist.")
        );

        if (post.getAuthor().getUserID().equals(requestUserID)) {
            postRepository.delete(post);
        } else {
            throw new UserNotAuthorizedException("User not authorized to delete this post.");
        }
    }

    public PostDTO getPostByID(Long postID) {
        Post post = postRepository.findById(postID).orElseThrow(
                () -> new PostNotFoundException("Post with postID " + postID + " does not exist.")
        );

        return dtoConversionService.convertToPostDTO(post);

    }
}
