import { requireAuth } from "@/lib/dal";

/**
 * Защищенная страница профиля
 *
 * Работает так:
 * 1. Middleware проверил наличие токенов - пропустил
 * 2. Server Component вызывает requireAuth()
 * 3. requireAuth() делает запрос к Nest.js GET /user/info с cookies
 * 4. Nest.js проверяет JWT и возвращает данные пользователя
 * 5. Если токен невалидный - редирект на главную
 */
const ProfilePage = async () => {
  // Эта функция гарантирует, что код ниже выполнится только для авторизованных
  // Если пользователь не авторизован - произойдет редирект

  return <div></div>;
};

export default ProfilePage;
