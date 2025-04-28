export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // Difference in seconds

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diff / seconds);
    if (interval >= 1)
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

export function formatDate(rawDate: string) {
  const date = new Date(rawDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
}
