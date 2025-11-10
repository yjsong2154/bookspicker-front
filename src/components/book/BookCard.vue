<script setup lang="ts">
import type { Book } from '@/types/book'
const props = defineProps<{ book: Book }>()
</script>

<template>
  <article class="book-card">
    <!-- 책 표지 이미지 -->
    <img :src="props.book.coverUrl" :alt="props.book.title" class="book-image" />
    
    <div class="book-info">
      <!-- 책 제목 -->
      <h3 class="book-title">{{ props.book.title }}</h3>
      <!-- 저자 -->
      <p class="book-author">{{ props.book.author }}</p>
      
      <!-- 책 장르 -->
      <div class="book-genre">
        <span>장르</span>
      </div>
      
      <!-- 버튼들 -->
      <div class="button-container">
        <!-- 바로 보기 버튼 -->
        <a :href="props.book.buyUrl" class="buy-button">바로 보기</a>
        <!-- 찜하기 버튼 -->
        <a :href="props.book.buyUrl" class="favorite-button">찜하기</a>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* 책 카드 스타일 */
.book-card {
  background-color: #2d2d2d;
  color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* 책 이미지 스타일 */
.book-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 책 정보 스타일 */
.book-info {
  padding: 16px;
}

/* 책 제목 스타일 */
.book-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 책 저자 스타일 */
.book-author {
  font-size: 14px;
  color: #a0a0a0;
  margin-bottom: 12px;
}

/* 책 장르 스타일 */
.book-genre {
  font-size: 12px;
  background-color: #555;
  color: #fff;
  padding: 4px 8px;
  border-radius: 16px;
  margin-bottom: 12px;
}

/* 버튼 컨테이너 스타일 */
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

/* 바로 보기 버튼 스타일 */
.buy-button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
}

.buy-button:hover {
  background-color: #0056b3;
}

/* 찜하기 버튼 스타일 */
.favorite-button {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
}

.favorite-button:hover {
  background-color: #5a6268;
}
</style>
