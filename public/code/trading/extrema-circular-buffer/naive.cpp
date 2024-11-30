#include <algorithm>
#include <deque>
#include <stdexcept>

class ExtremaCircularBuffer {
public:
  ExtremaCircularBuffer(size_t capacity) : capacity(capacity) {}

  void push_back(double value) {
    if (prices.size() == capacity) {
      prices.pop_front();
    }

    prices.push_back(value);
  }

  void pop_front() {
    if (prices.empty()) {
      throw std::out_of_range("Cannot pop_front() from empty buffer");
    }

    prices.pop_front();
  }

  size_t size() const { return prices.size(); }

  double get() const {
    if (prices.empty()) {
      throw std::out_of_range("Cannot find max() of empty buffer");
    }

    return *std::max_element(prices.begin(), prices.end());
  }

private:
  std::deque<double> prices;
  size_t capacity;
};
