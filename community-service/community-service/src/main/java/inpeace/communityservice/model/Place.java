package inpeace.communityservice.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="places")
public class Place {

    @Id
    @Column(name="place_id")
    private String placeID;

    @Column(nullable = false, name="place_name")
    private String placeName;

    @OneToMany(mappedBy = "place", fetch = FetchType.EAGER)
    private List<Post> posts = new ArrayList<>();

    public String getPlaceID() {
        return placeID;
    }

    public void setPlaceID(String placeID) {
        this.placeID = placeID;
    }

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
}
