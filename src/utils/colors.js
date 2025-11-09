export function getTopicColor(topicName) {
  switch ((topicName || "").toLowerCase()) {
    case "software":
      return "#0073e6";
    case "algorithms":
      return "#d50032";
    case "meditations":
      return "#6a0dad";
    case "autonomous-racing":
      return "#3d8a44";
    case "git":
      return "#cc5500";
    default:
      return null;
  }
}
