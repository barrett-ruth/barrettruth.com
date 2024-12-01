#include <deque>
#include <map>
#include <stdexcept>

class ExtremaCircularBuffer {
public:
  void push_back(double value) {
    if (prices.size() == capacity) {
      double front = prices.front();

      if (--sorted_prices[front] == 0)
        sorted_prices.erase(front);
      prices.pop_front();
    }

    prices.push_back(value);
    ++sorted_prices[value];
  }

  void pop_front() {
    if (prices.empty()) {
      throw std::out_of_range("Cannot pop_front() from empty buffer");
    }

    double front = prices.front();

    if (--sorted_prices[front] == 0)
      sorted_prices.erase(front);
    prices.pop_front();
  }

  size_t size() const { return prices.size(); }

  double get_max() const {
    if (prices.empty()) {
      throw std::out_of_range("Cannot find max() of empty buffer");
    }

    return sorted_prices.rbegin()->first;
  }

  double get_min() const {
    if (prices.empty()) {
      throw std::out_of_range("Cannot find min() of empty buffer");
    }

    return sorted_prices.begin()->first;
  }

  /* methods & fields omitted for brevity */
};
