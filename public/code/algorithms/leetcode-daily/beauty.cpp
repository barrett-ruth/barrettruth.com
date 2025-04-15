#include <vector>
#include <algorithm>

std::vector<int> maximumBeauty(std::vector<std::vector<int>>& items, std::vector<int>& queries) {
  std::sort(items.begin(), items.end());
  std::vector<std::pair<int, int>> sorted_queries;
  sorted_queries.reserve(queries.size());
  for (size_t i = 0; i < queries.size(); ++i) {
    sorted_queries.emplace_back(queries[i], i);
  }
  std::sort(sorted_queries.begin(), sorted_queries.end());

  int beauty = items[0][1];
  size_t i = 0;
  std::vector<int> ans(queries.size());

  for (const auto [query, index] : sorted_queries) {
    while (i < items.size() && items[i][0] <= query) {
        beauty = std::max(beauty, items[i][1]);
        ++i;
    }
    ans[index] = i > 0 && items[i - 1][0] <= query ? beauty : 0;
  }

  return ans;
}
