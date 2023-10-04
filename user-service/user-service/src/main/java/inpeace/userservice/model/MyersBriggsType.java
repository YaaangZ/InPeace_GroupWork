package inpeace.userservice.model;


import jakarta.persistence.*;

@Entity
@Table(name = "myersbriggstypes")
public class MyersBriggsType {

    @Id
    @Column(name="id")
    private Long id;

    @Column(name="personalitytype", unique = true, nullable = false)
    private String personalityType;

    @Column(name="role", unique = true, nullable = false)
    private String role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPersonalityType() {
        return personalityType;
    }

    public void setPersonalityType(String personalityType) {
        this.personalityType = personalityType;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString(){
        return getPersonalityType() + " - " + getRole();
    }

}
