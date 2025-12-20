# API Reference

This document provides the API specification for the Bookspicker Backend project.

## Authentication
Most endpoints require authentication using a JWT Bearer Token.
Values should be passed in the `Authorization` header: `Bearer <access_token>`

### 1. Login (Obtain Token)
*   **URL**: `/api/token/`
*   **Method**: `POST`
*   **Description**: Obtain access and refresh tokens by providing username and password.
*   **Request Body**:
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
        "refresh": "eyJ0...",
        "access": "eyJ0..."
    }
    ```

### 2. Refresh Token
*   **URL**: `/api/token/refresh/`
*   **Method**: `POST`
*   **Description**: Refresh the access token using a valid refresh token.
*   **Request Body**:
    ```json
    {
        "refresh": "your_refresh_token"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
        "access": "new_access_token"
    }
    ```

---

## Accounts (Cold Start)

### 3. Set Nickname
*   **URL**: `/accounts/coldstart/nickname/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Set the user's nickname.
*   **Request Body**:
    ```json
    {
        "nickname": "NewNickname"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
        "message": "닉네임 설정 완료",
        "user": { ... }
    }
    ```

### 4. Set Preferred Tags
*   **URL**: `/accounts/coldstart/tags/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Set the user's preferred tags (First time only).
*   **Request Body**:
    ```json
    {
        "tag_ids": [1, 2, 3]
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
        "message": "선호하는 태그가 성공적으로 설정되었습니다."
    }
    ```

### 5. Set Preferred Books
*   **URL**: `/accounts/coldstart/books/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Set the user's preferred books (First time only).
*   **Request Body**:
    ```json
    {
        "isbn_list": ["978...", "979..."]
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
        "message": "선호하는 책이 성공적으로 설정되었습니다."
    }
    ```

---

## Books

### 6. Book Detail
*   **URL**: `/api/books/<str:isbn>/`
*   **Method**: `GET`
*   **Auth Required**: No (Partial data for guests, full personalized data for auth users)
*   **Description**: Get detailed information about a book.
*   **Response (200 OK)**:
    ```json
    {
        "message": "도서 상세 정보 조회 성공",
        "book": {
            "isbn": "...",
            "title": "...",
            "description": "...",
            "is_liked": true,
            "is_wished": false,
            "comments": [ ... ]
            ...
        }
    }
    ```

### 7. Toggle Like
*   **URL**: `/api/books/<str:isbn>/likes/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Toggle the 'like' status for a book.
*   **Response (200 OK)**:
    ```json
    {
        "message": "좋아요 상태가 변경되었습니다.",
        "is_liked": true,
        "like_count": 10
    }
    ```

### 8. Toggle Wishlist
*   **URL**: `/api/books/<str:isbn>/wishlist/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Toggle the 'wishlist' status for a book.
*   **Response (200 OK)**:
    ```json
    {
        "message": "찜 상태가 변경되었습니다.",
        "is_wished": true
    }
    ```

### 9. Add Comment
*   **URL**: `/api/books/<str:isbn>/comment/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Add a comment (and optionally tags) to a book.
*   **Request Body**:
    ```json
    {
        "content": "This is a great book!",
        "tags": {
            "existing_tag_ids": [1],
            "new_tag_names": ["masterpiece"]
        }
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
        "message": "도서 코멘트가 등록되었습니다."
    }
    ```

### 10. Add to Library
*   **URL**: `/api/books/<str:isbn>/library/`
*   **Method**: `POST`
*   **Auth Required**: Yes
*   **Description**: Add a book to the user's library (start reading).
*   **Response (201 Created)**:
    ```json
    {
        "message": "도서가 내 서재에 추가되었습니다.",
        "library": { ... }
    }
    ```

---

## E-Book Viewer

### 11. Viewer Meta Data
*   **URL**: `/api/bookviews/<str:isbn>/`
*   **Method**: `GET`
*   **Auth Required**: Yes
*   **Description**: Get metadata for the viewer (initial location, progress, etc).
*   **Response (200 OK)**:
    ```json
    {
        "message": "도서 뷰 메타 조회 성공",
        "bookview": {
            "viewer": {
                "initial_location": 0,
                "progress_percent": 0.0
            },
            ...
        }
    }
    ```

### 12. Book Content
*   **URL**: `/api/bookviews/<str:isbn>/content/`
*   **Method**: `GET`
*   **Auth Required**: Yes
*   **Query Parameters**:
    *   `from`: Start index (default 0)
    *   `limit`: Number of characters to retrieve (default 1000, max 5000)
*   **Description**: Get the text content of the book.
*   **Response (200 OK)**:
    ```json
    {
        "message": "도서 본문 조회 성공",
        "content": {
            "text": "...",
            "has_more": true,
            "next_from": 1000
        }
    }
    ```

---

## Main

### 13. Current Reading
*   **URL**: `/api/main/current-reading/`
*   **Method**: `GET`
*   **Auth Required**: Yes
*   **Description**: Get the book the user is currently reading.
*   **Response (200 OK)**:
    ```json
    {
        "message": "지금 읽는 책 조회 성공",
        "current_reading_book": {
            "book": { ... },
            "last_read_at": "..."
        }
    }
    ```
