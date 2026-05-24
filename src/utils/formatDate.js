// utils/formatDate.js
// Mengubah string tanggal ISO menjadi format "Jan 01, 2025"
export const formatDate = (createdAt) => {
  if (createdAt) {
    const date = new Date(createdAt);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const year  = date.getFullYear();
    const month = months[date.getMonth()];
    const day   = date.getDate();
    return `${month} ${day}, ${year}`;
  }
  return "";
};
