package inpeace.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name="places")
public class Place {

    @Id
    @Column(name="place_id")
    private String placeID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private PlaceCategory category;

    @Column(name="place_name")
    private String placeName;

    @Column(name="rating")
    private Long rating;

}
