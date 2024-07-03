#include <fstream>
#include <iostream>

int main() {
  std::ifstream ifs{"aggieland.txt"};
  std::string read1;
  int read2;
  ifs >> read1 >> read2;
  std::cout << read1 << read2;
}
