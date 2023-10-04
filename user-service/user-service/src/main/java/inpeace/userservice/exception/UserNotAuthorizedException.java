package inpeace.userservice.exception;

public class UserNotAuthorizedException extends RuntimeException {

    public UserNotAuthorizedException(String message) {
            super(message);
    }
}

