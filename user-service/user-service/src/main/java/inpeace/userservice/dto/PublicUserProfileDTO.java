package inpeace.userservice.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class PublicUserProfileDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = -8445943548965154778L;

    private String username;
    private String bio;
    private String avatar;
    private String myersBriggsType;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getMyersBriggsType() {
        return myersBriggsType;
    }

    public void setMyersBriggsType(String myersBriggsType) {
        this.myersBriggsType = myersBriggsType;
    }
}