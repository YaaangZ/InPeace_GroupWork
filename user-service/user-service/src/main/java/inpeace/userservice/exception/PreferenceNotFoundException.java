package inpeace.userservice.exception;

public class PreferenceNotFoundException extends RuntimeException{
    public PreferenceNotFoundException(String message) {
        super(message);
    }
}
