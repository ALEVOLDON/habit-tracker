import { toast } from 'react-hot-toast';

/**
 * Показывает уведомление об успехе.
 * @param message - Сообщение для отображения.
 */
const success = (message: string) => toast.success(message);

/**
 * Показывает уведомление об ошибке.
 * @param message - Сообщение для отображения.
 */
const error = (message: string) => toast.error(message);

export const notificationService = { success, error };