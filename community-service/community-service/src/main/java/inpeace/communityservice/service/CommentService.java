package inpeace.communityservice.service;

import inpeace.communityservice.dao.CommentRepository;
import inpeace.communityservice.dao.PostRepository;
import inpeace.communityservice.dto.CommentDTO;
import inpeace.communityservice.exception.CommentNotFoundException;
import inpeace.communityservice.exception.PostNotFoundException;
import inpeace.communityservice.exception.UserNotAuthorizedException;
import inpeace.communityservice.model.Comment;
import inpeace.communityservice.model.Post;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CommentService {

    private final DTOConversionService dtoConversionService;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;


    public CommentService(DTOConversionService dtoConversionService, CommentRepository commentRepository, PostRepository postRepository) {
        this.dtoConversionService = dtoConversionService;
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public void createComment(CommentDTO commentDTO, Long requestUserID) {

        if (!commentDTO.getUserID().equals(requestUserID)){
            throw  new UserNotAuthorizedException("Comment userID and authorization token do not match.");
        }

        if (commentDTO.getParentPostID() == null && commentDTO.getParentCommentID() == null) {
            throw new IllegalArgumentException("ParentPostID and ParentCommentID cannot be null.");
        }
        else if (commentDTO.getParentPostID() != null && commentDTO.getParentCommentID() == null) {
            if (!postRepository.existsById(commentDTO.getParentPostID())) {
                throw new IllegalArgumentException("Post with ID: " + commentDTO.getParentPostID() + " does not exist.");
            }
        }

        else if (commentDTO.getParentCommentID() != null && commentDTO.getParentPostID() == null) {
            if (!commentRepository.existsById(commentDTO.getParentCommentID())) {
                throw new IllegalArgumentException("Comment with ID: " + commentDTO.getParentCommentID() + " does not exist.");
            }
        } else {
            throw new IllegalArgumentException("Comment cannot have ParentCommentID and ParentPostID");
        }

        Comment comment = dtoConversionService.convertToCommentFromCommentDTO(commentDTO);
        commentRepository.save(comment);
    }

    public List<CommentDTO> getCommentsForPost(Long postID) {
        Post existingPost = postRepository.findById(postID).
                orElseThrow(() -> new PostNotFoundException("Post with ID: " + postID + " does not exist."));

        List<Comment> comments = commentRepository.findAllCommentsForPost(existingPost.getPostID());
        List<Comment> sortedComments = sortCommentsByDate(comments);
        List<CommentDTO> commentDTOS = new ArrayList<>();

        if (!comments.isEmpty()){
            for (Comment comment : comments) {
                CommentDTO commentDTO = dtoConversionService.convertToDTOFromComment(comment);
                commentDTOS.add(commentDTO);
            }
            commentDTOS = structureComments(commentDTOS);
        }

        return commentDTOS;
    }

    public void updateComment(Long commentID, CommentDTO commentDTO, Long requestUserID) {
        Comment existingComment = commentRepository.findById(commentID)
                .orElseThrow(() -> new CommentNotFoundException("Comment with ID: " + commentID + " does not exist."));
        Comment updatedComment = dtoConversionService.convertToCommentFromCommentDTO(commentDTO);

        if (existingComment.getAuthor().getUserID().equals(requestUserID)){

            if (updatedComment.getContent() != null) {
                existingComment.setContent(updatedComment.getContent());
            }
            if (updatedComment.getParentPostID() != null) {
                existingComment.setParentPostID(updatedComment.getParentPostID());
            }
            if (updatedComment.getParentCommentID() != null) {
                existingComment.setParentCommentID(updatedComment.getParentCommentID());
            }

            existingComment.setDateUpdated(LocalDateTime.now());
            commentRepository.save(existingComment);
        }

        else {
            throw new UserNotAuthorizedException("User not authorized to update this comment");
        }
    }

    public void deleteComment(Long commentID, Long requestUserID) {
        Comment comment = commentRepository.findById(commentID).orElseThrow(
                () -> new CommentNotFoundException("Comment with commentID " + commentID + " does not exist.")
        );

        if (comment.getAuthor().getUserID().equals(requestUserID)){
            commentRepository.delete(comment);
        }
        else {
            throw new UserNotAuthorizedException("User not authorized to delete this comment");
        }
    }

    private List<CommentDTO> structureComments(List<CommentDTO> comments) {

        Map<Integer, CommentDTO> commentMap = new HashMap<>();

        for (CommentDTO comment : comments) {
            commentMap.put(Math.toIntExact(comment.getCommentID()), comment);
        }

        List<CommentDTO> rootComments = new ArrayList<>();

        for (CommentDTO comment : comments) {

            if (comment.getParentCommentID() == null) {
                rootComments.add(comment);
            } else {
                CommentDTO parentComment = commentMap.get(Math.toIntExact(comment.getParentCommentID()));
                    parentComment.addChild(comment);
                }
            }

        return rootComments;
    }

    private List<Comment> sortCommentsByDate(List<Comment> comments) {
        comments.sort(new Comparator<Comment>() {
            @Override
            public int compare(Comment o1, Comment o2) {
                return o1.getDateUpdated().compareTo(o2.getDateUpdated());
            }
        });
        return comments;
    }
}
