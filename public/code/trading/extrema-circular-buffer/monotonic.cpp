#include <deque>
#include <stdexcept>
#include <utility>

class ExtremaCircularBuffer {
public:
  void push_back(double value) {
    if (prices.size() == capacity) {
      double front_value = prices.front();
      pop_max(front_value);
      prices.pop_front();
    }

    prices.push_back(value);
    push_max(value);
  }

  void pop_front() {
    if (prices.empty()) {
      throw std::out_of_range("Cannot pop_front() from empty buffer");
    }

    double front_value = prices.front();
    pop_max(front_value);
    prices.pop_front();
  }

  double get_max() const {
    if (prices.empty()) {
      throw std::out_of_range("Cannot find max() of empty buffer");
    }

    return maxs.front().first;
  }

private:
  void push_max(double value) {
    size_t popped = 0;

    while (!maxs.empty() && maxs.back().first < value) {
      popped += maxs.back().second + 1;
      maxs.pop_back();
    }

    maxs.emplace_back(value, popped);
  }

  void pop_max(double value) {
    size_t popped = maxs.front().second;

    if (popped == 0) {
      maxs.pop_front();
    } else {
      --maxs.front().second;
    }
  }

  /* methods & fields omitted for brevity */
};
