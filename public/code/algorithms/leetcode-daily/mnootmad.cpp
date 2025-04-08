class Solution {
public:
    int minimumOperations(vector<int>& nums) {
        vector<int> freq(101, 0);
        int i;
        for (i = nums.size() - 1; i >= 0; --i) {
            if (++freq[nums[i]] == 2) {
                return ceil((i + 1) / 3.0);
            }
        }
        return 0;
    }
};
