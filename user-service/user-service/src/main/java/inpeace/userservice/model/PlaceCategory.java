package inpeace.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class PlaceCategory {

    @Id
    @Column(name="categoryid")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name="categoryname", unique = true, nullable = false)
    private String category;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
