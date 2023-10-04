package inpeace.communityservice.dto;

import java.io.Serializable;
import java.util.List;

public class TagListDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<String> tags;

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}

