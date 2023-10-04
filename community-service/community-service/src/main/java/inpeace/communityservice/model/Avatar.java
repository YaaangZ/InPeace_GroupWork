package inpeace.communityservice.model;

import jakarta.persistence.*;

@Entity
@Table(name="avatars")
public class Avatar {

    @Id
    @Column(name="id")
    private Long avatarID;

    @Column(name="file_name", columnDefinition = "TEXT")
    private String avatarName;

    @Column(name="svg_data", columnDefinition = "TEXT")
    private String svg;

    public Long getAvatarID() {
        return avatarID;
    }

    public void setAvatarID(Long id) {
        this.avatarID = id;
    }

    public String getAvatarName() {
        return avatarName;
    }

    public void setAvatarName(String avatar_name) {
        this.avatarName = avatar_name;
    }

    public String getSvg() {
        return svg;
    }

    public void setSvg(String svg) {
        this.svg = svg;
    }
}