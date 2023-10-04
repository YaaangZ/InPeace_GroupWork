package inpeace.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "busyness")
public class Busyness {

    @Id
    @Column(name="busynessid")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name="busynesslevel", unique = true, nullable = false)
    private String busyness;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusyness() {
        return busyness;
    }

    public void setBusyness(String busyness) {
        this.busyness = busyness;
    }
}
