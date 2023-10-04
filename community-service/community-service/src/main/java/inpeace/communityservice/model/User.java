package inpeace.communityservice.model;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {

    @Id
    @Column(name="userid")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long userID;

    @Column(nullable = false, name="username")
    private String username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="avatarid")
    private Avatar avatar;

    @Column(nullable = false, name="emailaddress")
    private String emailAddress;

    @Column (nullable = false, name="encodedpassword")
    private String encodedPassword;

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Avatar getAvatar() {
        return avatar;
    }

    public void setAvatar(Avatar avatar) {
        this.avatar = avatar;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getEncodedPassword() {
        return encodedPassword;
    }

    public void setEncodedPassword(String encodedPassword) {
        this.encodedPassword = encodedPassword;
    }
}
