package inpeace.userservice.dto;

public class PlaceDTO {

    private int placeID;
    private String category;
    private String name;
    private long rating;

    public PlaceDTO() {
        this.placeID = 0;
        this.category = "";
        this.name = "";
        this.rating = 0;
    }

    public int getPlaceID() {
        return placeID;
    }

    public void setPlaceID(int placeID) {
        this.placeID = placeID;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getRating() {
        return rating;
    }

    public void setRating(long rating) {
        this.rating = rating;
    }
}
