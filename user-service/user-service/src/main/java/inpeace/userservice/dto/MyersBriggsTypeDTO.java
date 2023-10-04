package inpeace.userservice.dto;

public class MyersBriggsTypeDTO {

    private String acronym;
    private String fullName;
    private String professionalRole;

    public MyersBriggsTypeDTO() {
    }

    public MyersBriggsTypeDTO(String acronym, String fullName) {
        this.acronym = acronym;
        this.fullName = fullName;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
