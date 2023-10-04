package inpeace.userservice.security;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String secret;

    public String parseTokenGetEmailAddress(String token){

        // Generate a Key from the secret (set by us in application.properties)
        Key signingKey = Keys.hmacShaKeyFor(secret.getBytes());

        String email =  Jwts.parserBuilder()
                .setSigningKey(signingKey) //  setting the signing key that will be used to parse the token
                .build()
                .parseClaimsJws(token) //  parses the JWT and returns a JWS (Json Web Signature) object
                .getBody() //  retrieves the Claims object from the JWS object
                .getSubject(); // finally gets back the subject -- which is what was transformed into the token in the first place

        System.out.println(email);
        return email;
    }

    public Long parseTokenGetUserID(String token) {
        // Generate a Key from the secret (set by us in application.properties)
        Key signingKey = Keys.hmacShaKeyFor(secret.getBytes());

        Long userID =  Jwts.parserBuilder()
                .setSigningKey(signingKey) // setting the signing key that will be used to parse the token
                .build()
                .parseClaimsJws(token) // parses the JWT and returns a JWS (Json Web Signature) object
                .getBody() // retrieves the Claims object from the JWS object
                .get("userID", Long.class); // finally gets back the userID -- which is a claim in the token

        System.out.println(userID);
        return userID;
    }

}
