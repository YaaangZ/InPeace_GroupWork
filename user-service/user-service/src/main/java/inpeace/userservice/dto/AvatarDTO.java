package inpeace.userservice.dto;

import java.io.Serializable;

public class AvatarDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long avatarID;
    private String avatar;

    public AvatarDTO() {}

    public AvatarDTO(Long avatarID, String avatar) {
        this.avatarID = avatarID;
        this.avatar = avatar;
    }

    public Long getAvatarID() {
        return avatarID;
    }

    public void setAvatarID(Long avatarID) {
        this.avatarID = avatarID;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}

