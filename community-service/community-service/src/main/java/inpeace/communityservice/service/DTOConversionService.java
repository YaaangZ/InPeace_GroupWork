package inpeace.communityservice.service;

import inpeace.communityservice.dao.*;
import inpeace.communityservice.dto.CommentDTO;
import inpeace.communityservice.dto.PostDTO;
import inpeace.communityservice.exception.PlaceNotFoundException;
import inpeace.communityservice.exception.UserNotFoundException;
import inpeace.communityservice.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DTOConversionService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final PostTagRepository postTagRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;

    public DTOConversionService(CommentRepository commentRepository, PostRepository postRepository, PostTagRepository postTagRepository, TagRepository tagRepository, UserRepository userRepository, PlaceRepository placeRepository){
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.postTagRepository = postTagRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.placeRepository = placeRepository;
    }

    public PostDTO convertToPostDTO(Post post){
        PostDTO postDTO = new PostDTO();

        postDTO.setPostID(post.getPostID());
        postDTO.setUserID(post.getAuthor().getUserID());
        postDTO.setUsername(post.getAuthor().getUsername());
        postDTO.setAvatar(post.getAuthor().getAvatar().getSvg());
        postDTO.setPostTitle(post.getTitle());
        postDTO.setPostContent(post.getContent());

        if (post.getPlace() != null){
            postDTO.setPlaceID(post.getPlace().getPlaceID());
        }

        List<Tag> postTags = post.getTags();
        List<String> postTagStrings = new ArrayList<>();
        for (Tag postTag : postTags){
            String postTagString = convertToTagString(postTag);
            postTagStrings.add(postTagString);
        }
        postDTO.setPostTags(postTagStrings);

        return postDTO;
    }

    public Post convertToPost(PostDTO postDTO) {
        Post post = new Post();

        User author = userRepository.findByUserID(postDTO.getUserID())
                .orElseThrow(() -> new UserNotFoundException("User with ID: " + postDTO.getUserID() + " not found."));
        post.setAuthor(author);
        post.setTitle(postDTO.getPostTitle());
        post.setContent(postDTO.getPostContent());
        post.setDateCreated(LocalDateTime.now());
        post.setDateUpdated(LocalDateTime.now());

        // Ensuring placeID is optional
        if (postDTO.getPlaceID() != null) {
            Place place = placeRepository.findById(postDTO.getPlaceID())
                    .orElseThrow(() -> new PlaceNotFoundException("Place with ID: " + postDTO.getPlaceID() + " not found."));
            post.setPlace(place);
        }

        // PostID is generated and set by the database once the post is saved.
        post = postRepository.save(post);

        if (postDTO.getPostTags() != null) {
            for (String tagStr : postDTO.getPostTags()) {
                Tag tag = convertToTag(tagStr);
                PostTag postTag = new PostTag();
                postTag.setId(new PostTagID(post.getPostID(), tag.getTagID()));
                postTagRepository.save(postTag);
            }
        }

        return post;
    }


    public String convertToTagString(Tag tag){
        return tag.getTagString();
    }

    public Tag convertToTag(String tagString) {
        return tagRepository.findByTagString(tagString)
                .orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setTagString(tagString);
                    return tagRepository.save(newTag);
                });
    }

    public Comment convertToCommentFromCommentDTO(CommentDTO commentDTO) {
        Comment comment = new Comment();

        User author = userRepository.findByUserID(commentDTO.getUserID()).orElseThrow();
        comment.setAuthor(author);
        if (commentDTO.getParentPostID() != null){
            comment.setParentPostID(commentDTO.getParentPostID());
        }
        if (commentDTO.getParentCommentID() != null){
            comment.setParentCommentID(commentDTO.getParentCommentID());
        }

        comment.setContent(commentDTO.getCommentContent());
        comment.setDateCreated(LocalDateTime.now());
        comment.setDateUpdated(LocalDateTime.now());

        return comment;
    }

    public CommentDTO convertToDTOFromComment(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();

        commentDTO.setCommentID(comment.getCommentID());
        commentDTO.setUserID(comment.getAuthor().getUserID());
        commentDTO.setUsername(comment.getAuthor().getUsername());
        commentDTO.setAvatar(comment.getAuthor().getAvatar().getSvg());
        commentDTO.setParentCommentID(comment.getParentCommentID());
        commentDTO.setParentPostID(comment.getParentPostID());
        commentDTO.setCommentContent(comment.getContent());

        return commentDTO;
    }
}


