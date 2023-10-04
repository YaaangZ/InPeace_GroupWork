package inpeace.userservice.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="accessibilityneeds")
public class AccessibilityNeed {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name="accessibilityneedid")
    private Long accessibilityID;

    @Column(name="accessibility")
    private String accessibilityString;

    @ManyToMany(mappedBy="accessibilityNeeds")
    private List<User> users = new ArrayList<>();

    public Long getAccessibilityID() {
        return accessibilityID;
    }

    public void setAccessibilityID(Long tagID) {
        this.accessibilityID = tagID;
    }

    public String getAccessibilityString() {
        return accessibilityString;
    }

    public void setAccessibilityString(String tag) {
        this.accessibilityString = tag;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void addUser(User user) {
        users.add(user);
        user.getAccessibilityNeeds().add(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.getAccessibilityNeeds().remove(this);
    }

    @Override
    public boolean equals(Object o){
        if (this == o) {
            return true;
        }
        else if (o == null || getClass() != o.getClass()) {
            return false;
        }
        else {
            AccessibilityNeed other = (AccessibilityNeed) o;
            return (Objects.equals(other.getAccessibilityString(), this.getAccessibilityString()));
        }
    }

}
