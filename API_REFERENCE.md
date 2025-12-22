# API Reference (Detailed)

**Base URL**: `http://localhost:8000`

---

## 1. Authentication

### Google Social Login

**POST** `/accounts/social-login/`

구글 인증 코드를 백엔드로 보내 JWT 토큰을 발급받습니다.

**Request Body**

```json
{
  "code": "4/0ATX..." // (Required) Google Authorization Code
}
```

**Response (200 OK)**

```json
{
  "message": "Login Success",
  "user": {
    "id": 1,
    "username": "example@gmail.com",
    "email": "example@gmail.com"
  },
  "token": {
    "access": "eyJhbGciOiJIUzI1NiIsIn...", // JWT Access Token
    "refresh": "eyJhbGciOiJIUzI1NiIsIn..." // JWT Refresh Token
  }
}
```

**Error (400 Bad Request)**

- `code` 필드가 누락되었거나 구글 인증에 실패한 경우.

---

## 2. Cold Start (초기 설정)

**Header**: `Authorization: Bearer <access_token>`

### 2-1. 닉네임 설정

**POST** `/accounts/coldstart/nickname/`

**Request Body**

```json
{
  "nickname": "booklover" // (Required) 2~20자, 영문/숫자/언더바(_)만 허용
}
```

**Response (200 OK)**

```json
{
  "message": "닉네임 설정 완료",
  "user": {
    "id": 1,
    "username": "...",
    "nickname": "booklover"
  }
}
```

### 2-2. 취향 태그 설정 (최초 1회)

**POST** `/accounts/coldstart/tags/`

**Request Body**

```json
{
  "tag_ids": [101, 203, 50] // (Required) Tag ID 리스트 (정수형)
}
```

**Response (200 OK)**

```json
{
  "message": "선호하는 태그가 성공적으로 설정되었습니다."
}
```

### 2-3. 관심 도서 선택 (최초 1회)

**POST** `/accounts/coldstart/books/`

**Request Body**

```json
{
  "isbn_list": ["9788931234567", "9781234567890"] // (Required) ISBN 문자열 리스트
}
```

**Response (200 OK)**

```json
{
  "message": "선호하는 책이 성공적으로 설정되었습니다."
}
```

### 2-4. 추가 프로필 정보

**POST** `/accounts/coldstart/profile_info/`

**Request Body**

```json
{
  "profile_info": {
    "birth_year": 1995, // (Optional) 1900 ~ 현재 연도
    "sex": "F", // (Optional) "F" (여성), "M" (남성), "N" (무관)
    "books_per_month": 3 // (Optional) 0 ~ 300
  }
}
```

**Response (200 OK)**

```json
{
  "message": "콜드스타트 추가 정보가 저장되었습니다.",
  "profile_info": {
    "birth_year": "1995",
    "sex": "F",
    "books_per_month": 3
  }
}
```

---

## 3. Books (도서)

### 3-1. 인기/추천 도서 목록

**GET** `/api/books/popular/?q={weekly|monthly|steady}`

**Parameters**

- `q`: `weekly` (주간 인기), `monthly` (월간 인기), `steady` (스테디셀러) (Default: `weekly`)

**Response (200 OK)**

```json
{
  "message": "많이 읽힌 도서 목록 조회 성공",
  "query": "weekly",
  "items": [
    {
      "isbn": "9788912345678",
      "title": "도서 제목",
      "cover_image": "http://image.url/...",
      "publisher": "출판사명",
      "abstract_descript": "짧은 줄거리...",
      "like_count": 120,
      "is_liked": true,
      "top_tags": [
        {
          "id": 10,
          "name": "SF",
          "slug": "sf",
          "color": "#42A5F5"
        }
      ],
      "links": {
        "like_toggle_url": "/books/9788912345678/likes",
        "read_url": "/bookviews/9788912345678",
        "purchase_url": "..."
      }
    }
  ]
}
```

### 3-2. 도서 상세 조회

**GET** `/api/books/{isbn}/`
**Header**: `Authorization: Bearer <token>` (Optional - 로그인 시 좋아요/서재 여부 확인 가능)

**Response (200 OK)**

```json
{
  "message": "도서 상세 정보 조회 성공",
  "book": {
    "isbn": "9788912345678",
    "title": "Clean Code",
    "genre_path": "컴퓨터 > 소프트웨어 공학",
    "cover_image": "...",
    "authors": [
      {
        "author_id": 1,
        "name": "Robert C. Martin",
        "role": "AUTHOR",
        "bio": "..."
      }
    ],
    "publisher": "인사이트",
    "published_date": "2013-12-24",
    "like_count": 500,
    "is_liked": true,
    "is_wished": false,
    "action_urls": {
      "read_now_url": "...",
      "wish_url": "...",
      "purchase_url": "..."
    },
    "why_picked": {
      "body": "추천 사유 텍스트..."
    },
    "book_tags": [{ "id": 1, "name": "Refactoring", "tag_count": 50 }],
    "description": "상세 책 소개...",
    "comments": [
      {
        "comment_id": 101,
        "user": { "id": 5, "nickname": "dev_king" },
        "content": "최고의 책입니다.",
        "created_at": "2024-01-01T12:00:00Z",
        "is_owner": false
      }
    ],
    "comment_count": 1
  }
}
```

### 3-3. 도서 검색

**GET** `/api/books/search/?query={keyword}&page=1`

**Parameters**

- `query`: 검색어 (제목, 저자, 출판사 등)

**Response (200 OK)**

```json
{
  "message": "도서 검색 성공",
  "meta": { "total_count": 100, "page": 1, "has_next": true },
  "books": [
    {
      "isbn": "...",
      "title": "...",
      "authors": ["홍길동"],
      "publisher": "...",
      "cover_image": "...",
      "is_liked": false
    }
  ]
}
```

---

## 4. Interaction (상호작용)

**Header**: `Authorization: Bearer <access_token>`

### 4-1. 좋아요 토글

**POST** `/api/books/{isbn}/likes/`

**Response (200 OK)**

```json
{
  "message": "좋아요 상태가 변경되었습니다.",
  "like_count": 121,
  "is_liked": true // or false
}
```

### 4-2. 찜하기 토글 (위시리스트)

**POST** `/api/books/{isbn}/wishlist/`

**Response (200 OK)**

```json
{
  "message": "찜 상태가 변경되었습니다.",
  "is_wished": true // or false
}
```

### 4-3. 내 서재 추가

**POST** `/api/books/{isbn}/library/`

**Response (200 OK)**

```json
{
  "message": "내 서재에 도서가 추가되었습니다.",
  "library": {
    "isbn": "...",
    "is_downloaded": false,
    "added_at": "..."
  }
}
```

### 4-4. 내 서재 삭제

**DELETE** `/api/books/{isbn}/library/`

**Response (200 OK)**

```json
{
  "message": "내 서재에서 도서가 삭제되었습니다.",
  "isbn": "...",
  "in_library": false
}
```

### 4-5. 코멘트 작성

**POST** `/api/books/{isbn}/comment/`

**Request Body**

```json
{
  "content": "책이 정말 재미있네요! 강력 추천합니다.", // (Required)
  "tags": {
    // (Optional)
    "existing_tag_ids": [1, 5],
    "new_tag_names": ["인생책", "강추"]
  }
}
```

**Response (201 Created)**

```json
{
  "message": "도서 코멘트가 등록되었습니다."
}
```

### 4-6. 코멘트 삭제

**DELETE** `/api/books/{isbn}/comment/{comment_id}/delete/`

---

## 5. User Personal (마이페이지)

**Header**: `Authorization: Bearer <access_token>`

### 5-1. 내 도서 목록 (서재/찜/좋아요/최근)

**GET** `/accounts/booklist/?filter={library|liked|wishlist|recent}&limit=20&offset=0`

**Parameters**

- `filter`: 목록 필터 타입 (필수)
- `limit`, `offset`: 페이지네이션

**Response (200 OK)**

```json
{
  "message": "도서 목록 조회 성공",
  "filter": "library",
  "meta": { "total_count": 5, "limit": 20, "has_next": false },
  "books": [
    {
      "isbn": "...",
      "title": "...",
      "added_at": "...", // filter별로 날짜 필드명이 조금씩 다름 (added_at, liked_at, last_read_at)
      "cover_image": "..."
    }
  ]
}
```

### 5-2. 내 코멘트 목록

**GET** `/accounts/comments/?limit=20&offset=0`

**Response (200 OK)**

```json
{
  "message": "내 코멘트 목록 조회 성공",
  "comments": [
    {
      "comment_id": 10,
      "content": "좋았습니다.",
      "book": { "isbn": "...", "title": "..." },
      "created_at": "..."
    }
  ]
}
```

### 5-3. 닉네임 변경

**PATCH** `/accounts/nickname/`

**Request Body**

```json
{
  "nickname": "new_awesome_name"
}
```

### 5-4. 회원 탈퇴

**POST** `/accounts/resign/`

**Request Body**

```json
{
  "confirm": true,
  "refresh": "refresh_token_string" // 로그아웃 처리를 위해 필요
}
```
