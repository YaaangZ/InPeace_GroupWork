package inpeace.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="posts")
public class Post {

    @Id
    @Column(name="postid")
    private Long postid;

    @Column(name="title")
    private String title;
}