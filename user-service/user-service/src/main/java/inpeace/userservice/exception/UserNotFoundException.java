package inpeace.userservice.exception;

import java.util.List;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
