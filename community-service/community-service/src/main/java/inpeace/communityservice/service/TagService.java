package inpeace.communityservice.service;

import inpeace.communityservice.dao.PostRepository;
import inpeace.communityservice.dao.TagRepository;
import inpeace.communityservice.dto.PostDTO;
import inpeace.communityservice.exception.PostNotFoundException;
import inpeace.communityservice.exception.UserNotAuthorizedException;
import inpeace.communityservice.model.Post;
import inpeace.communityservice.model.Tag;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagService {

    private final DTOConversionService dtoConversionService;
    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    public TagService(DTOConversionService dtoConversionService, PostRepository postRepository, TagRepository tagRepository){
        this.dtoConversionService = dtoConversionService;
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
    }

    public List<String> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<String> tagStrings = new ArrayList<>();

        for (Tag tag : tags) {
            String tagString = dtoConversionService.convertToTagString(tag);
            tagStrings.add(tagString);
        }
        return tagStrings;
    }

    public List<String> getAllTagsForPost(Long postID) {
        Post existingPost = postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with ID: " + postID + " does not exist found."));

        List<String> tagStrings = new ArrayList<>();

        for (Tag tag : existingPost.getTags()){
            tagStrings.add(tag.getTagString());
        }
        return tagStrings;
    }

    public void addTagsToPost(Long postID, List<String> tagStrings, Long requestUserID) {
        Post existingPost = postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with ID: " + postID + " does not exist."));

        if (!existingPost.getAuthor().getUserID().equals(requestUserID)){
            throw new UserNotAuthorizedException("User not authorized to add tags to this post.");
        }

        else {
            for (String tagString : tagStrings){
                Tag tag = dtoConversionService.convertToTag(tagString);
                if (!existingPost.getTags().contains(tag)) {
                    existingPost.addTag(tag);
                }
            }
            postRepository.save(existingPost);
        }
    }

    public void removeTagsFromPost(Long postID, List<String> tagStrings, Long requestUserID) {
        Post existingPost = postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with ID: " + postID + " does not exist found."));

        if (!existingPost.getAuthor().getUserID().equals(requestUserID)){
            throw new UserNotAuthorizedException("User not authorized to remove tags from this post.");
        }
        else {
            for (String tagString : tagStrings){
                Tag tag = dtoConversionService.convertToTag(tagString);
                existingPost.removeTag(tag);
            }

            postRepository.save(existingPost);
        }

    }

    public void removeAllTagsFromPost(Long postID, Long requestUserID) {
        Post existingPost = postRepository.findById(postID)
                .orElseThrow(() -> new PostNotFoundException("Post with ID: " + postID + " does not exist found."));

        if (!existingPost.getAuthor().getUserID().equals(requestUserID)){
            throw new UserNotAuthorizedException("User not authorized to clear tags from this post.");
        }
        else {
            existingPost.setTags(new ArrayList<>());
            postRepository.save(existingPost);
        }
    }

    public List<PostDTO> getPostsForTags(List<String> tagStrings) {
        List<PostDTO> postDTOs = new ArrayList<>();
        // Check if tagStrings is null or empty
        if(tagStrings == null || tagStrings.isEmpty()) {
            return postDTOs;
        }
        // Convert the first tag string to a tag and get its posts
        Tag firstTag = dtoConversionService.convertToTag(tagStrings.get(0));
        // Loop through assuming there are posts for the first tag
        if(firstTag != null && firstTag.getPosts() != null) {
            List<Post> postsForTags = new ArrayList<>(firstTag.getPosts());
            // For each of the remaining tag strings, intersect the posts with the current list
            for (int i = 1; i < tagStrings.size(); i++) {
                Tag nextTag = dtoConversionService.convertToTag(tagStrings.get(i));
                if(nextTag != null && nextTag.getPosts() != null) {
                    postsForTags.retainAll(nextTag.getPosts());
                }else {
                    return postDTOs;
                }
            }
            // Convert the resulting list of posts to PostDTOs
            for (Post post : postsForTags) {
                PostDTO postDTO = dtoConversionService.convertToPostDTO(post);
                if(postDTO != null) {
                    postDTOs.add(postDTO);
                }
            }
        }

        return postDTOs;
    }


}
