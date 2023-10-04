package inpeace.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "indooroutdoor")
public class IndoorOutdoor {

    @Id
    @Column(name="indooroutdoorid")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name="preference", unique = true, nullable = false)
    private String indoorOutdoor;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIndoorOutdoor() {
        return indoorOutdoor;
    }

    public void setIndoorOutdoor(String indoorOutdoor) {
        this.indoorOutdoor = indoorOutdoor;
    }
}
