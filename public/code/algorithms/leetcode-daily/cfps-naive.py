def countFairPairs(self, nums, lower, upper):
    nums.sort()
    ans = 0

    for i, num in enumerate(nums):
       k = bisect_left(nums, lower - num, 0, i)
       j = bisect_right(nums, upper - num, 0, i)

       ans += k - j

    return ans
