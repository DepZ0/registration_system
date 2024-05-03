We have a few routes [ /registration, /login, /logout, /details, /account-delete, /refresh-token ]

1. /registration { POST
    For registration we need to make POST request and put in BODY 'email' and 'password'.
    Like this {
        email : test@test.com,
        password : 123456  (Minimum password length = 6 characters)
    }
    If all good we wiil get answer "Registration successful"
};

2. /login { POST
    For login we need to make POST request and put in BODY 'email' and 'password'.
    Like this {
        email : test@test.com,
        password : 123456  (Minimum password length = 6 characters)
    }
    If all good we wiil get answer {
        "response": "Login successful",
        "accessToken": "",
        "refreshToken": ""
    }
    So after "Login successful" we have "accessToken" and "refreshToken".
};

3. /logout { POST
    For logout we need to make POST request and put in BODY 'refreshToken'.
    Like this {
        "refreshToken": ""
    }
    If all good we will get "Logged out successfully".
};

4. /details { POST
    For change account details we need to make POST request and put datails such as
    [email, password, name, surname, phoneNumber, dateOfBirthday, description (maximum 300 symbols)] in BODY,
    and we mast put in HEADERS our "accessToken".
    We can choose only 1 detail from list of details.
    Like this {
        name : "Joe"
    }
    If all good we will get "Profile details updated successfully".

    If you want delete some detail use " ", like this {
        name : " "
    }
}

5. /account-delete { POST
    For delete your account we need to make POST request and put in HEADERS "accessToken".
    Like this {
        Authorization : "Bearer TOKEN"
    }
};

6. /refresh-token { POST
    For get refresh "accessToken" we may use this route.
    Like this {
        "refreshToken": ""
    }
}

---
Dont forget to change .env
---
