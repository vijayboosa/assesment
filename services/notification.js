// services/notifications.js
export const emitToRole = (io, role, event, data) => {
  io.to(role).emit(event, data);
};

export const emitToUser = (io, userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data);
};