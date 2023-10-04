package inpeace.userservice.controller;

import inpeace.userservice.security.JWTService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ControllerUtils {

    private final JWTService jwtService;

    public ControllerUtils(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    public Map<String, String> getErrorResponse(String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        return errorResponse;
    }

    public Map<String, String> getSuccessResponse(String message){
        Map<String, String> successResponse = new HashMap<>();
        successResponse.put("message", message);
        return successResponse;
    }

    public Long getUserIDFromBearer(String bearerToken){
        String token = bearerToken.split(" ")[1];
        return  jwtService.parseTokenGetUserID(token);
    }
}

