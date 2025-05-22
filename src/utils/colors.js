export function getTopicColor(topicName) {
  switch (topicName) {
    case "software":
      return "#0073e6";
    case "operating-systems":
      return "#009975";
    case "algorithms":
      return "#d50032";
    case "meditations":
      return "#6a0dad";
    default:
      return "#000000";
  }
}
